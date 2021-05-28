import { detach, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Request, RequestModel, RequestSnapshot } from "../request/request"

/**
 * Model description here for TypeScript hints.
 */
export const NewRequestStoreModel = types
  .model("NewRequestStore")
  .props({
    request: types.maybe(RequestModel),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    /** Frees the request from the store; this should be done immediately before saving into the request store */
    free: (request: Request) => {
      detach(request)
    },
    save: (request: RequestSnapshot) => {
      console.log("Saving...")
      self.request = request
      // if (!self.request) {
      //   console.log("No request exists, creating a new one with id", request.id)
      //   self.request = request
      // } else {
      //   console.log("Request exists, applying snapshot with id", request.id, request.requestedAt)
      //   applySnapshot(self, { request: request })
      // }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type NewRequestStoreType = Instance<typeof NewRequestStoreModel>
export interface NewRequestStore extends NewRequestStoreType {}
type NewRequestStoreSnapshotType = SnapshotOut<typeof NewRequestStoreModel>
export interface NewRequestStoreSnapshot extends NewRequestStoreSnapshotType {}
export const createNewRequestStoreDefaultModel = () => types.optional(NewRequestStoreModel, {})
