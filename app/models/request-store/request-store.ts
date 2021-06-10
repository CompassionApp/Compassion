import { applyPatch, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import R from "ramda"
// import { async } from "validate.js"
import { RequestApi } from "../../services/firebase-api/request-api"
import { RequestStatusEnum } from "../../types"
import { withEnvironment } from "../extensions/with-environment"
import { RequestModel, RequestSnapshot } from "../request/request"

// TODO: Static auth context for now; replace with firebase auth context later
const authContext = { userId: "test-user" }

/**
 * Stores the active requests for the user and its loading state
 */
export const RequestStoreModel = types
  .model("RequestStore")
  .props({
    requests: types.array(RequestModel),
    isLoading: types.optional(types.boolean, false),
    currentRequest: types.safeReference(RequestModel),
  })
  .extend(withEnvironment)
  .views((self) => ({
    get sortByCreated() {
      return sortByCreatedAt(self.requests)
    },
  }))
  .actions((self) => ({
    markLoading: () => {
      self.isLoading = true
    },
    updateRequests: (requests: RequestSnapshot[]) => {
      applyPatch(self, { op: "replace", path: "/requests", value: requests })
      self.isLoading = false
    },
    saveRequest: (requestSnapshot: RequestSnapshot) => {
      // Appending a value to the local array via `push`
      self.requests.push(requestSnapshot)
    },
    deleteRequest: (requestId: string) => {
      // Deleting an element from the local store using `splice` (mutates array)
      const index = self.requests.findIndex((request) => request.id === requestId)
      self.requests.splice(index, 1)
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
    /** Sets the current request that's viewed */
    selectCurrentRequest: (requestId: string) => {
      self.currentRequest = self.requests.find((r) => r.id === requestId)
    },
  }))
  .actions((self) => ({
    /**
     * Sends the request to the server
     */
    createRequest: flow(function* (request: RequestSnapshot) {
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = yield requestApi.createRequest(request, authContext)
      if (result.kind === "ok") {
        self.saveRequest(request)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
    /**
     * Get all requests for the user
     */
    getRequests: flow(function* () {
      self.markLoading()
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const {
        kind,
        requests,
      }: { kind: string; requests: RequestSnapshot[] } = yield requestApi.getRequests(authContext)

      if (kind === "ok") {
        self.updateRequests(requests)
      } else {
        __DEV__ && console.log(kind)
      }
    }),
    rescheduleRequest: flow(function* (requestId: string) {
      console.log("[request-store] Rescheduling (deleting)", requestId)
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = yield requestApi.deleteRequest(requestId, authContext)

      if (result.kind === "ok") {
        self.deleteRequest(requestId)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
    changeRequestStatus: flow(function* (requestId: string, status: RequestStatusEnum) {
      console.log("[request-store] Changing status", requestId, status)
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = yield requestApi.changeRequestStatus(requestId, status, authContext)

      if (result.kind === "ok") {
        self.updateRequest(requestId, { status })
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))

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
