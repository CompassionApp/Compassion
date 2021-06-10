import { applySnapshot, detach, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Request, RequestModel, RequestSnapshot } from "../request/request"

/**
 * Model description here for TypeScript hints.
 */
export const NewRequestStoreModel = types
  .model("NewRequestStore")
  .props({
    request: types.maybe(RequestModel),
  })
  .actions((self) => ({
    /** Frees the request from the store; this should be done immediately before saving into the request store */
    free: (request: Request) => {
      detach(request)
    },
    save: (request: RequestSnapshot) => {
      console.log("[new-request-store] Saving...")
      applySnapshot(self, { request })
    },
  }))

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
export const createNewRequestStoreDefaultModel = () =>
  types.optional(NewRequestStoreModel, { request: undefined })
