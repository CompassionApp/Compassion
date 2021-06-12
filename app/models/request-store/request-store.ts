import { applyPatch, flow, getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import R from "ramda"
import { MAX_CHAPERONES_PER_REQUEST } from "../../constants/match"
// import { async } from "validate.js"
import { RequestApi } from "../../services/firebase-api/request-api"
import { RequestStatusEnum } from "../../types"
import { withAuthContext } from "../extensions/with-auth-context"
import { withEnvironment } from "../extensions/with-environment"
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
    currentRequest: types.safeReference(RequestModel),
  })
  .extend(withEnvironment)
  .extend(withAuthContext)
  .views((self) => ({
    get sortUserRequestsByCreated() {
      return sortByCreatedAt(self.requests)
    },
    get sortAvailableRequestsByCreated() {
      return sortByCreatedAt(self.availableRequests)
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
    updateAvailableRequests: (requests: RequestSnapshot[]) => {
      applyPatch(self, { op: "replace", path: "/availableRequests", value: requests })
      self.isLoading = false
    },
    updateRequests: (requests: RequestSnapshot[]) => {
      applyPatch(self, { op: "replace", path: "/requests", value: requests })
      self.isLoading = false
    },
    saveRequest: (requestSnapshot: RequestSnapshot) => {
      if (!self.requests.find((request) => request.id === requestSnapshot.id)) {
        self.requests.push(requestSnapshot)
      }
    },
    saveAvailableRequest: (requestSnapshot: RequestSnapshot) => {
      if (!self.availableRequests.find((request) => request.id === requestSnapshot.id)) {
        self.availableRequests.push(requestSnapshot)
      }
    },
    deleteRequest: (requestId: string) => {
      // Deleting an element from the local store using `splice` (mutates array)
      const index = self.requests.findIndex((request) => request.id === requestId)
      self.requests.splice(index, 1)
    },
    deleteAvailableRequest: (requestId: string) => {
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
      const fromUserRequests = self.requests.find((r) => r.id === requestId)
      const fromAvailableRequests = self.availableRequests.find((r) => r.id === requestId)
      self.currentRequest = fromUserRequests ?? fromAvailableRequests
    },
  }))
  .actions((self) => ({
    /**
     * Sends the request to the server
     */
    createRequest: flow(function* (request: RequestSnapshot) {
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = yield requestApi.createRequest(request, self.authContext)
      if (result.kind === "ok") {
        self.saveRequest(request)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Get all open requests for the requester
     */
    getRequests: flow(function* () {
      self.markLoading()
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const {
        kind,
        requests,
      }: { kind: string; requests: RequestSnapshot[] } = yield requestApi.getUserRequests(
        self.authContext,
      )

      if (kind === "ok") {
        self.updateRequests(requests)
      } else {
        __DEV__ && console.log(kind)
      }
    }),

    /**
     * Get all available requests for the chaperone
     */
    getAvailableRequests: flow(function* () {
      self.markLoading()
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const {
        kind,
        requests,
      }: { kind: string; requests: RequestSnapshot[] } = yield requestApi.getAvailableRequests()

      if (kind === "ok") {
        self.updateAvailableRequests(requests)
      } else {
        __DEV__ && console.log(kind)
      }
    }),

    /**
     * Accept request as a chaperone
     */
    acceptRequest: flow(function* (requestId: string) {
      console.log("[request-store] Accepting request", requestId)
      const requestApi = new RequestApi(self.environment.firebaseApi)
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
      requestModel.addChaperone(self.authContext.email)
      requestModel.setStatus(RequestStatusEnum.SCHEDULED)
      requestModel.touchUpdatedDate()

      const mutatedRequest = getSnapshot(requestModel)
      // Update the request record for the requester and in the general request pool
      const result = yield requestApi.acceptUserRequest(
        requestId,
        mutatedRequest,
        mutatedRequest.requestedBy,
        self.authContext,
      )

      if (result.kind === "ok") {
        // self.saveRequest(mutatedRequest)
        // self.deleteAvailableRequest(mutatedRequest.id)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Release a request as a chaperone
     */
    releaseRequest: flow(function* (requestId: string) {
      console.log("[request-store] Releasing request", requestId)
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const request = self.requests.find((r) => r.id === requestId)
      if (!request) {
        throw new Error("Request cannot be found")
      }
      const requestModel = RequestModel.create(getSnapshot(request))

      // Start mutating our copy to the "released" state
      requestModel.removeChaperone(self.authContext.email)
      requestModel.setStatus(RequestStatusEnum.REQUESTED)
      requestModel.touchUpdatedDate()

      const mutatedRequest = getSnapshot(requestModel)
      // Update the request record for the requester and in the general request pool
      const result = yield requestApi.releaseUserRequest(
        requestId,
        mutatedRequest,
        mutatedRequest.requestedBy,
        self.authContext,
      )

      if (result.kind === "ok") {
        // self.deleteRequest(mutatedRequest.id)
        // self.saveAvailableRequest(mutatedRequest)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Reschedule a request (currently deletes the request)
     */
    rescheduleRequest: flow(function* (requestId: string) {
      console.log("[request-store] Rescheduling (deleting)", requestId)
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = yield requestApi.deleteRequest(requestId, self.authContext)

      if (result.kind === "ok") {
        self.deleteRequest(requestId)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    /**
     * Change the request's status
     */
    changeRequestStatus: flow(function* (requestId: string, status: RequestStatusEnum) {
      console.log("[request-store] Changing status", requestId, status)
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = yield requestApi.updateRequest(requestId, { status }, self.authContext)

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
        const requestApi = new RequestApi(self.environment.firebaseApi)
        const unsubscribeUserRequests = requestApi.subscribeToUserRequests(
          self.authContext,
          (requests) => {
            console.log(
              "[request-store] User's requests from subscription:",
              requests.map((r) => r.id),
            )
            self.updateRequests(requests)
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
        const requestApi = new RequestApi(self.environment.firebaseApi)
        const unsubscribeAvailableRequests = requestApi.subscribeToAvailableRequests((requests) => {
          console.log(
            "[request-store] New requests from subscription:",
            requests.map((r) => r.id),
          )
          self.updateAvailableRequests(requests)
        })
        const unsubscribeUserRequests = requestApi.subscribeToUserRequests(
          self.authContext,
          (requests) => {
            console.log(
              "[request-store] User's requests from subscription:",
              requests.map((r) => r.id),
            )
            self.updateRequests(requests)
          },
        )

        unsubscribeHandlers.push(unsubscribeAvailableRequests)
        unsubscribeHandlers.push(unsubscribeUserRequests)
        return {
          unsubscribeAvailableRequests,
          unsubscribeUserRequests,
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

function sortByCreatedAt(requests) {
  return requests.slice().sort((a, b) => a.createdAt < b.createdAt)
}
