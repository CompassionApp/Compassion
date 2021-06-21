import { applyPatch, flow, getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
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
import { RequestModel, RequestSnapshot } from "../request/request"

/**
 * Stores the active requests for the user and its loading state
 */
export const RequestStoreModel = types
  .model("RequestStore")
  .props({
    requests: types.optional(types.array(RequestModel), []),
    availableRequests: types.optional(types.array(RequestModel), []),
    isLoading: types.optional(types.boolean, false),
    currentRequest: types.maybe(types.safeReference(RequestModel)),
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
    clear: () => {
      self.requests.clear()
      self.availableRequests.clear()
      self.currentRequest = undefined
    },
    markLoading: () => {
      self.isLoading = true
    },
    _updateAvailableRequests: (requests: RequestSnapshot[]) => {
      applyPatch(self, { op: "replace", path: "/availableRequests", value: requests })
      self.isLoading = false
    },
    _updateRequests: (requests: RequestSnapshot[]) => {
      console.log("[request-store] Updating requests", requests)
      applyPatch(self, { op: "replace", path: "/requests", value: requests })
      self.isLoading = false
    },
    _saveRequest: (requestSnapshot: RequestSnapshot) => {
      if (!self.requests.find((request) => request.id === requestSnapshot.id)) {
        self.requests.push(requestSnapshot)
      }
    },
    _saveAvailableRequest: (requestSnapshot: RequestSnapshot) => {
      if (!self.availableRequests.find((request) => request.id === requestSnapshot.id)) {
        self.availableRequests.push(requestSnapshot)
      }
    },
    _deleteRequest: (requestId: string) => {
      // Deleting an element from the local store using `splice` (mutates array)
      const index = self.requests.findIndex((request) => request.id === requestId)
      self.requests.splice(index, 1)
    },
    _deleteAvailableRequest: (requestId: string) => {
      const index = self.requests.findIndex((request) => request.id === requestId)
      self.availableRequests.splice(index, 1)
    },

    updateRequest: (requestId: string, request: Partial<RequestSnapshot>) => {
      // Modifying the local store
      const index = self.requests.findIndex((request) => request.id === requestId)
      const original = self.requests[index]
      applyPatch(self, {
        op: "replace",
        path: `/requests/${index}`,
        value: R.mergeDeepRight<RequestSnapshot, Partial<RequestSnapshot>>(original, request),
      })
    },

    updateAvailableRequest: (requestId: string, request: Partial<RequestSnapshot>) => {
      const index = self.requests.findIndex((request) => request.id === requestId)
      const original = self.requests[index]
      applyPatch(self, {
        op: "replace",
        path: `/availableRequests/${index}`,
        value: R.mergeDeepRight<RequestSnapshot, Partial<RequestSnapshot>>(original, request),
      })
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
    createRequest: flow(function* (request: RequestSnapshot) {
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
      self.markLoading()
      const {
        kind,
        requests,
      }: {
        kind: string
        requests: RequestSnapshot[]
      } = yield self.environment.requestApi.getUserRequests(self.authContext)

      if (kind === "ok") {
        self._updateRequests(requests)
      } else {
        __DEV__ && console.log(kind)
      }
    }),

    /**
     * Get all available requests for the chaperone
     */
    getAvailableRequests: flow(function* () {
      self.markLoading()
      const {
        kind,
        requests,
      }: {
        kind: string
        requests: RequestSnapshot[]
      } = yield self.environment.requestApi.getAvailableRequests()

      if (kind === "ok") {
        self._updateAvailableRequests(requests)
      } else {
        __DEV__ && console.log(kind)
      }
    }),

    /**
     * Accept request as a chaperone
     */
    acceptRequest: flow(function* (requestId: string) {
      console.log("[request-store] Accepting request", requestId)
      const request = self.availableRequests.find((r) => r.id === requestId)
      if (!request) {
        throw new Error("Request cannot be found")
      }
      const requestModel = RequestModel.create(getSnapshot(request))

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
        requestId,
        mutatedRequest,
        mutatedRequest.requestedBy.email,
        self.authContext,
      )

      if (result.kind === "ok") {
        // self.saveRequest(mutatedRequest)
        // self.deleteAvailableRequest(mutatedRequest.id)
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
    releaseRequest: flow(function* (requestId: string) {
      console.log("[request-store] Releasing request", requestId)
      const request = self.requests.find((r) => r.id === requestId)
      if (!request) {
        throw new Error("Request cannot be found")
      }
      // Create a mutable copy of the request
      const requestModel = RequestModel.create(getSnapshot(request))
      // Start mutating our copy to the "released" state
      requestModel.removeChaperone(self.authContext.email)
      requestModel.setStatus(RequestStatusEnum.REQUESTED)
      requestModel.touchUpdatedDate()
      const mutatedRequest = getSnapshot(requestModel)
      // Update the request record for the requester and in the general request pool
      const result = yield self.environment.requestApi.releaseUserRequest(
        requestId,
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
    rescheduleRequest: flow(function* (request: RequestSnapshot) {
      console.log("[request-store] Rescheduling", request.id)
      const result = yield self.environment.requestApi.updateRequest(
        request.id,
        { status: RequestStatusEnum.CANCELED_BY_REQUESTER },
        self.authContext,
      )

      if (result.kind === "ok") {
        self.updateRequest(request.id, { status: RequestStatusEnum.CANCELED_BY_REQUESTER })

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
    cancelRequestAsRequester: flow(function* (request: RequestSnapshot) {
      console.log("[request-store] Canceling as requester", request.id)
      const result = yield self.environment.requestApi.updateRequest(
        request.id,
        { status: RequestStatusEnum.CANCELED_BY_REQUESTER },
        self.authContext,
      )

      if (result.kind === "ok") {
        self.updateRequest(request.id, { status: RequestStatusEnum.CANCELED_BY_REQUESTER })

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
        self.updateRequest(requestId, { status })
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
            self._updateRequests(requests)
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
            self._updateAvailableRequests(requests)
          },
        )
        const unsubscribeUserRequests = self.environment.requestApi.subscribeToUserRequests(
          self.authContext,
          (requests) => {
            console.log(
              "[request-store] User's requests from subscription:",
              requests.map((r) => r.id),
            )
            self._updateRequests(requests)
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
            self._updateAvailableRequests(requests)
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

function sortByCreatedAt(a: RequestSnapshot, b: RequestSnapshot) {
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
