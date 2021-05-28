import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import R from "ramda"
// import { async } from "validate.js"
import { RequestApi } from "../../services/firebase-api/request-api"
import { Request, RequestStatusEnum } from "../../types"
import { withEnvironment } from "../extensions/with-environment"
import { RequestModel, RequestSnapshot } from "../request/request"

// TODO: Static auth context for now; replace with firebase auth context later
const authContext = { userId: "test-user" }

/**
 * Model description here for TypeScript hints.
 */
export const RequestStoreModel = types
  .model("RequestStore")
  .props({
    requests: types.array(RequestModel),
    isLoading: types.optional(types.boolean, false),
    currentRequestId: types.maybe(types.string),
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
    saveRequests: (requestStoreSnapshot: RequestStoreSnapshot) => {
      applySnapshot(self, requestStoreSnapshot)
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
    updateRequest: (requestId: string, request: Partial<Request>) => {
      // Modifying the local store
      const index = self.requests.findIndex((request) => request.id === requestId)
      const original = self.requests[index]
      self.requests[index] = R.mergeDeepRight<Request>(original, request as Request)
    },
    /** Sets the current request by id */
    selectCurrentRequest: (requestId: string) => {
      self.currentRequestId = requestId
    },
  }))
  .actions((self) => ({
    /**
     * Sends the request to the server
     */
    createRequest: flow(function* createRequest(request: RequestSnapshot) {
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = yield requestApi.createRequest(request, authContext)
      if (result.kind === "ok") {
        self.saveRequest(result.request)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
    getRequests: async () => {
      self.markLoading()
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = await requestApi.getRequests(authContext)

      if (result.kind === "ok") {
        self.saveRequests(result.requests)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
    rescheduleRequest: async (requestId: string) => {
      console.log("Rescheduling (deleting)", requestId)
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = await requestApi.deleteRequest(requestId, authContext)

      if (result.kind === "ok") {
        self.deleteRequest(requestId)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
    cancelRequest: async (requestId: string) => {
      console.log("Cancelling", requestId)
      const requestApi = new RequestApi(self.environment.firebaseApi)
      const result = await requestApi.changeRequestStatus(
        requestId,
        RequestStatusEnum.CANCELED_BY_REQUESTER,
        authContext,
      )

      if (result.kind === "ok") {
        self.updateRequest(requestId, { status: RequestStatusEnum.CANCELED_BY_REQUESTER })
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
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
