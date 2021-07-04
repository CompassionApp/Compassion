import { cast, flow, getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import R from "ramda"
import { MAX_CHAPERONES_PER_REQUEST } from "../../constants/match"
import { RequestStatusEnum } from "../../types"
import {
  createNewRequestNotification,
  createRequestAcceptedNotification,
  createRequestCanceledByChaperoneNotification,
  createRequestCanceledByRequesterNotification,
} from "../../utils/notification-factory"
import { withAuthContext } from "../extensions/with-auth-context"
import { withEnvironment } from "../extensions/with-environment"
import { NotificationModel } from "../notification/notification"
import { SubscriptionManager, SubscriptionTypeEnum } from "../../utils/subscriptions"
import {
  ChaperoneRequest,
  ChaperoneRequestModel,
  ChaperoneRequestSnapshot,
} from "../chaperone-request/chaperone-request"

/**
 * Stores the active requests for the user and its loading state
 */
export const RequestStoreModel = types
  .model("RequestStore")
  .props({
    /** Collection of requests for the user in `/user/[email]/requests/*` */
    requests: types.optional(types.array(ChaperoneRequestModel), []),
    /** Collection of availale requests in the pool in `/requests/*` */
    availableRequests: types.optional(types.array(ChaperoneRequestModel), []),
    /** Reference to the currently selected request; for the detail page */
    currentRequest: types.maybeNull(types.safeReference(ChaperoneRequestModel)),
    /** Flag for determining if the user request subscription is active */
    userRequestSubscriptionActive: types.optional(types.boolean, false),
    /** Flag for determining if the available request subscription is active */
    availableRequestSubscriptionActive: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .extend(withAuthContext)
  .views((self) => ({
    /** Returns sorted user requests (by request date descending) that have been matched */
    get sortedUserRequestsMatched() {
      return self.requests
        .filter((request) => request.status === RequestStatusEnum.SCHEDULED)
        .slice()
        .sort(sortByRequestedAt)
    },

    /** Returns sorted user requests (by request date descending) that have been matched */
    get sortedUserRequestsPending() {
      return self.requests
        .filter((request) => request.status !== RequestStatusEnum.SCHEDULED)
        .slice()
        .sort(sortByRequestedAt)
    },

    /** For Chaperones. Returns sorted user requests (by request date descending) */
    get sortedUserRequests() {
      return self.requests.slice().sort(sortByRequestedAt)
    },

    /** For Chaperones. Returns sorted availale requests (by request date descending) */
    get sortedAvailableRequests() {
      return self.availableRequests.slice().sort(sortByRequestedAt)
    },
  }))
  .actions((self) => ({
    /** Clears the store */
    clear: () => {
      self.requests.clear()
      self.availableRequests.clear()
      self.currentRequest = undefined
    },
    _replaceAvailableRequests: (requests: ChaperoneRequestSnapshot[]) => {
      self.availableRequests = cast(requests)
    },
    _replaceRequests: (requests: ChaperoneRequestSnapshot[]) => {
      console.log("[request-store] Updating requests", requests)
      self.requests = cast(requests)
    },
    _saveRequest: (requestSnapshot: ChaperoneRequestSnapshot) => {
      if (!self.requests.find((request) => request.id === requestSnapshot.id)) {
        self.requests.push(requestSnapshot)
      }
    },
    _deleteRequest: (requestId: string) => {
      // Deleting an element from the local store using `splice` (mutates array)
      const index = self.requests.findIndex((request) => request.id === requestId)
      self.requests.splice(index, 1)
    },

    _updateRequest: (requestId: string, request: Partial<ChaperoneRequestSnapshot>) => {
      // Modifying the local store
      const index = self.requests.findIndex((request) => request.id === requestId)
      if (index < 0) {
        throw new Error("Request not found")
      }

      const merged = R.mergeDeepRight<ChaperoneRequestSnapshot, Partial<ChaperoneRequestSnapshot>>(
        self.requests[index],
        request,
      ) as ChaperoneRequestSnapshot
      self.requests[index] = cast(merged)
    },

    /** Sets the current request that is being viewed in the detail screen */
    selectCurrentRequest: (requestId: string | null) => {
      console.log("[request-store] Selecting request", requestId)
      if (requestId === null) {
        self.currentRequest = null
        return
      }

      const fromUserRequests = self.requests.find((r) => r.id === requestId)
      const fromAvailableRequests = self.availableRequests.find((r) => r.id === requestId)
      self.currentRequest = fromUserRequests ?? fromAvailableRequests
      console.log("[request-store] Request found, setting current id to", self.currentRequest?.id)
    },
  }))
  .actions((self) => ({
    /**
     * Creates a new request in Firestore and sends a notification to all chaperones
     */
    createRequest: flow(function* (request: ChaperoneRequestSnapshot) {
      const result = yield self.environment.requestApi.createRequest(request, self.authContext)
      if (result.kind === "ok") {
        self._saveRequest(request)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }

      // Notify the chaperones
      const notification = NotificationModel.create(
        createNewRequestNotification(self.authContext.profile, request),
      )
      yield self.environment.notificationApi.notifyAllChaperones(notification)
    }),

    /**
     * Get all open requests for the requester
     */
    getRequests: flow(function* () {
      const {
        kind,
        requests,
      }: {
        kind: string
        requests: ChaperoneRequestSnapshot[]
      } = yield self.environment.requestApi.getUserRequests(self.authContext)

      if (kind === "ok") {
        self._replaceRequests(requests)
      } else {
        __DEV__ && console.log(kind)
      }
    }),

    /**
     * Get all available requests for the chaperone
     */
    getAvailableRequests: flow(function* () {
      const {
        kind,
        requests,
      }: {
        kind: string
        requests: ChaperoneRequestSnapshot[]
      } = yield self.environment.requestApi.getAvailableRequests()

      if (kind === "ok") {
        self._replaceAvailableRequests(requests)
      } else {
        __DEV__ && console.log(kind)
      }
    }),

    /**
     * Accept request as a chaperone
     */
    acceptRequest: flow(function* (request: ChaperoneRequest) {
      console.log("[request-store] Accepting request", request.id)
      if (!request) {
        throw new Error("Invalid request")
      }
      // Validate the request
      if (!validateRequestBeforeAccept(request)) {
        return
      }
      const requestModel = ChaperoneRequestModel.create(getSnapshot(request))

      // Start mutating our copy to the "accepted" state
      requestModel.addChaperone(self.authContext.profile.preview)
      requestModel.setStatus(RequestStatusEnum.SCHEDULED)
      requestModel.touchUpdatedDate()

      const mutatedRequestSnapshot = getSnapshot(requestModel)
      // Update the request record for the requester and in the general request pool
      const result = yield self.environment.requestApi.acceptUserRequest(
        request.id,
        mutatedRequestSnapshot,
        mutatedRequestSnapshot.requestedBy.email,
        self.authContext,
      )

      if (result.kind === "ok") {
        // FYI: Using mutatedRequestSnapshot in this section because at this point the `request` is
        // no longer valid since the subscriptions will move the entry between `request` and
        // `availableRequest`.

        // Notify the chaperones
        const notification = NotificationModel.create(
          createRequestAcceptedNotification(self.authContext.profile, mutatedRequestSnapshot),
        )
        yield self.environment.notificationApi.notifyUser(
          mutatedRequestSnapshot.requestedBy.email,
          notification,
        )
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Release a request as a chaperone
     */
    releaseRequest: flow(function* (request: ChaperoneRequest) {
      console.log("[request-store] Releasing request", request.id)
      if (!request) {
        throw new Error("Invalid request")
      }
      // Create a mutable copy of the request
      const requestModel = ChaperoneRequestModel.create(getSnapshot(request))
      // Start mutating our copy to the "released" state
      requestModel.removeChaperone(self.authContext.email)
      requestModel.setStatus(RequestStatusEnum.REQUESTED)
      requestModel.touchUpdatedDate()
      const mutatedRequestSnapshot = getSnapshot(requestModel)
      // Update the request record for the requester and in the general request pool
      const result = yield self.environment.requestApi.releaseUserRequest(
        request.id,
        mutatedRequestSnapshot,
        mutatedRequestSnapshot.requestedBy.email,
        self.authContext,
      )

      if (result.kind === "ok") {
        // FYI: Using mutatedRequestSnapshot in this section because at this point the `request` is
        // no longer valid since the subscriptions will move the entry between `request` and
        // `availableRequest`.

        // Notify the requester
        const canceledNotification = NotificationModel.create(
          createRequestCanceledByChaperoneNotification(
            self.authContext.profile,
            mutatedRequestSnapshot,
          ),
        )
        yield self.environment.notificationApi.notifyUser(
          mutatedRequestSnapshot.requestedBy.email,
          canceledNotification,
        )

        // Notify the chaperones
        const chaperoneNotification = NotificationModel.create(
          createNewRequestNotification(self.authContext.profile, mutatedRequestSnapshot),
        )
        yield self.environment.notificationApi.notifyAllChaperones(chaperoneNotification, {
          authContext: self.authContext,
          excludeSelf: true,
        })
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Reschedule a request
     */
    rescheduleRequest: flow(function* (request: ChaperoneRequest) {
      console.log("[request-store] Rescheduling", request.id)

      if (request.isCanceled) {
        console.log("[request-store] Request already canceled. Doing nothing.")
        return
      }

      const result = yield self.environment.requestApi.updateRequest(
        request.id,
        { status: RequestStatusEnum.CANCELED_BY_REQUESTER },
        self.authContext,
      )

      if (result.kind === "ok") {
        self._updateRequest(request.id, { status: RequestStatusEnum.CANCELED_BY_REQUESTER })

        const notification = NotificationModel.create(
          createRequestCanceledByRequesterNotification(self.authContext.profile, request),
        )
        request.chaperones.forEach((chaperone) => {
          self.environment.notificationApi.notifyUser(chaperone.email, notification)
        })
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Delete a request
     */
    deleteRequest: flow(function* (requestId: string) {
      console.log("[request-store] Deleting", requestId)
      const result = yield self.environment.requestApi.deleteRequest(requestId, self.authContext)

      if (result.kind === "ok") {
        self._deleteRequest(requestId)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Cancel a request as a requester and notifies any chaperones associated with the request
     */
    cancelRequestAsRequester: flow(function* (request: ChaperoneRequestSnapshot) {
      console.log("[request-store] Canceling as requester", request.id)
      const result = yield self.environment.requestApi.updateRequest(
        request.id,
        { status: RequestStatusEnum.CANCELED_BY_REQUESTER },
        self.authContext,
      )

      if (result.kind === "ok") {
        self._updateRequest(request.id, { status: RequestStatusEnum.CANCELED_BY_REQUESTER })

        const notification = NotificationModel.create(
          createRequestCanceledByRequesterNotification(self.authContext.profile, request),
        )
        request.chaperones.forEach((chaperone) => {
          self.environment.notificationApi.notifyUser(chaperone.email, notification)
        })
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Change the request's status
     */
    changeRequestStatus: flow(function* (requestId: string, status: RequestStatusEnum) {
      console.log("[request-store] Changing status", requestId, status)
      const result = yield self.environment.requestApi.updateRequest(
        requestId,
        { status },
        self.authContext,
      )

      if (result.kind === "ok") {
        self._updateRequest(requestId, { status })
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))

  /**
   * Subscriptions
   */
  .actions((self) => {
    /** Collection of unsubscribe handlers from our onSnapshot listeners */
    const subscriptionManager = new SubscriptionManager()

    return {
      /**
       * Unsubscribes from all previously registered subscriptions
       */
      unsubscribeAll: () => {
        console.log(`[request-store] Unsubscribing to ${subscriptionManager.size} subscriptions`)

        subscriptionManager.unsubscribeAll((type) => {
          console.log(`Unsubscribing to ${type}`)
          switch (type) {
            case SubscriptionTypeEnum.AVAILABLE_REQUESTS:
              self.availableRequestSubscriptionActive = false
              break
            case SubscriptionTypeEnum.USER_REQUESTS:
              self.userRequestSubscriptionActive = false
              break
          }
        })
      },

      /**
       * Subscribes to changes to requests for a requester
       *
       * Returns unsubscribe functions that must be called upon unmount.
       */
      subscribeAsRequester: () => {
        const unsubscribeUserRequests = self.environment.requestApi.subscribeToUserRequests(
          self.authContext,
          (requests) => {
            console.log(
              "[request-store] User's requests from subscription:",
              requests.map((r) => r.id),
            )
            self._replaceRequests(requests)
          },
        )
        subscriptionManager.registerSubscription(
          SubscriptionTypeEnum.USER_REQUESTS,
          unsubscribeUserRequests,
        )
        self.userRequestSubscriptionActive = true
      },

      /**
       * Subscribes to changes to requests for a chaperone.
       *
       * Returns unsubscribe functions that must be called upon unmount.
       */
      subscribeAsChaperone: () => {
        const unsubscribeAvailableRequests = self.environment.requestApi.subscribeToAvailableRequests(
          (requests) => {
            console.log(
              "[request-store] New requests from subscription:",
              requests.map((r) => r.id),
            )
            self._replaceAvailableRequests(requests)
          },
        )
        subscriptionManager.registerSubscription(
          SubscriptionTypeEnum.AVAILABLE_REQUESTS,
          unsubscribeAvailableRequests,
        )
        self.availableRequestSubscriptionActive = true

        const unsubscribeUserRequests = self.environment.requestApi.subscribeToUserRequests(
          self.authContext,
          (requests) => {
            console.log(
              "[request-store] User's requests from subscription:",
              requests.map((r) => r.id),
            )
            self._replaceRequests(requests)
          },
        )
        subscriptionManager.registerSubscription(
          SubscriptionTypeEnum.USER_REQUESTS,
          unsubscribeUserRequests,
        )
        self.userRequestSubscriptionActive = true
      },

      /**
       * Subscribes to changes to all available requests as an admin.
       *
       * Returns unsubscribe functions that must be called upon unmount.
       */
      subscribeAsAdmin: () => {
        const unsubscribeAvailableRequests = self.environment.requestApi.subscribeToAvailableRequests(
          (requests) => {
            console.log(
              "[request-store] Subscribing to new all available requests, inc.:",
              requests.map((r) => r.id),
            )
            self._replaceAvailableRequests(requests)
          },
        )

        subscriptionManager.registerSubscription(
          SubscriptionTypeEnum.AVAILABLE_REQUESTS,
          unsubscribeAvailableRequests,
        )
        self.availableRequestSubscriptionActive = true
      },
    }
  })

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type RequestStoreType = Instance<typeof RequestStoreModel>
export interface RequestStore extends RequestStoreType {}
type RequestStoreSnapshotType = SnapshotOut<typeof RequestStoreModel>
export interface RequestStoreSnapshot extends RequestStoreSnapshotType {}
export const createRequestStoreDefaultModel = () => types.optional(RequestStoreModel, {})

/** Sorts by requested at descending */
function sortByRequestedAt(a: ChaperoneRequest, b: ChaperoneRequest) {
  const aTime = new Date(a.requestedAt).getTime()
  const bTime = new Date(b.requestedAt).getTime()
  if (aTime < bTime) {
    return -1
  }
  if (aTime > bTime) {
    return 1
  }
  return 0
}

/**
 * Validates a request before accepting
 *
 * Returns true if passing; throws an error if not
 */
function validateRequestBeforeAccept(request: ChaperoneRequest) {
  if (request.status !== RequestStatusEnum.REQUESTED) {
    throw new Error("Request is not in the correct state")
  } else if (request.chaperones.length + 1 > MAX_CHAPERONES_PER_REQUEST) {
    throw new Error("Too many chaperones")
  }

  return true
}
