import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const RequestModel = types.model("Request").props({
  id: types.identifier,
  createdAt: types.maybe(types.string),
  requestedAt: types.maybe(types.string),
  updatedAt: types.maybe(types.string),
  meetAddress: types.maybe(types.string),
  destinationAddress: types.maybe(types.string),
  otherComments: types.maybe(types.string),
  requestStatusReason: types.maybe(types.string),
  chaperones: types.maybe(types.array(types.string)),
  status: types.maybe(types.string),
  type: types.maybe(types.string),
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type RequestType = Instance<typeof RequestModel>
export interface Request extends RequestType {}
type RequestSnapshotType = SnapshotOut<typeof RequestModel>
export interface RequestSnapshot extends RequestSnapshotType {}
export const createRequestDefaultModel = () => types.optional(RequestModel, {})
