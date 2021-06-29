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
    requests: types.optional(types.array(ChaperoneRequestModel), []),
    availableRequests: types.optional(types.array(ChaperoneRequestModel), []),
    currentRequest: types.maybe(types.safeReference(ChaperoneRequestModel)),
  })
  .extend(withEnvironment)
  .extend(withAuthContext)
  .views((self) => ({
    get sortUserRequestsByCreated() {
      return self.requests.slice().sort(sortByCreatedAt)
    },
    get sortAvailableRequestsByCreated() {
      return self.availableRequests.slice().sort(sortByCreatedAt)
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
    selectCurrentRequest: (requestId: string) => {
      console.log("[request-store] Selecting request", requestId)
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
      const requestModel = ChaperoneRequestModel.create(getSnapshot(request))

      // Do some light validation; this logic should be extracted to a helper function later:
      // validateRequestBeforeAccept
      if (requestModel.status !== RequestStatusEnum.REQUESTED) {
        throw new Error("Request is not in the correct state")
      } else if (requestModel.chaperones.length + 1 > MAX_CHAPERONES_PER_REQUEST) {
        throw new Error("Too many chaperones")
      }

      // Start mutating our copy to the "accepted" state
      requestModel.addChaperone(self.authContext.profile.preview)
      requestModel.setStatus(RequestStatusEnum.SCHEDULED)
      requestModel.touchUpdatedDate()

      const mutatedRequest = getSnapshot(requestModel)
      // Update the request record for the requester and in the general request pool
      const result = yield self.environment.requestApi.acceptUserRequest(
        request.id,
        mutatedRequest,
        mutatedRequest.requestedBy.email,
        self.authContext,
      )

      if (result.kind === "ok") {
        // Notify the chaperones
        const notification = NotificationModel.create(
          createRequestAcceptedNotification(self.authContext.profile, request),
        )
        yield self.environment.notificationApi.notifyUser(request.requestedBy.email, notification)
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
      const mutatedRequest = getSnapshot(requestModel)
      // Update the request record for the requester and in the general request pool
      const result = yield self.environment.requestApi.releaseUserRequest(
        request.id,
        mutatedRequest,
        mutatedRequest.requestedBy.email,
        self.authContext,
      )

      if (result.kind === "ok") {
        // Notify the chaperones
        const notification = NotificationModel.create(
          createRequestCanceledByChaperoneNotification(self.authContext.profile, request),
        )
        yield self.environment.notificationApi.notifyUser(request.requestedBy.email, notification)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Reschedule a request
     */
    rescheduleRequest: flow(function* (request: ChaperoneRequestSnapshot) {
      console.log("[request-store] Rescheduling", request.id)
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
    const unsubscribeHandlers: (() => void)[] = []

    return {
      /**
       * Unsubscribes from all previously registered subscriptions
       */
      unsubscribeAll: () => {
        console.log(`[request-store] Unsubscribing to ${unsubscribeHandlers.length} subscriptions`)

        while (unsubscribeHandlers.length > 0) {
          const unsubscribe = unsubscribeHandlers.pop()
          unsubscribe()
        }
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
        unsubscribeHandlers.push(unsubscribeUserRequests)
        return { unsubscribeUserRequests }
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

        unsubscribeHandlers.push(unsubscribeAvailableRequests)
        unsubscribeHandlers.push(unsubscribeUserRequests)
        return {
          unsubscribeAvailableRequests,
          unsubscribeUserRequests,
        }
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

        unsubscribeHandlers.push(unsubscribeAvailableRequests)
        return {
          unsubscribeAvailableRequests,
        }
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

function sortByCreatedAt(a: ChaperoneRequestSnapshot, b: ChaperoneRequestSnapshot) {
  const aTime = new Date(a.createdAt).getTime()
  const bTime = new Date(b.createdAt).getTime()
  if (aTime < bTime) {
    return 1
  }
  if (aTime > bTime) {
    return -1
  }
  return 0
}
