import { Instance, SnapshotOut, types } from "mobx-state-tree"
import jsonSchemaToTypes from "jsonschema-to-mobx-state-tree"
import FeedbackSchema from "../../types/Feedback.schema.json"
import { Feedback as _Feedback } from "../../types"

const fromSchema = jsonSchemaToTypes(types)
/**
 * Model description here for TypeScript hints.
 */
export const FeedbackModel = fromSchema(FeedbackSchema)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type FeedbackType = Instance<typeof FeedbackModel>
export interface Feedback extends FeedbackType, _Feedback {}
type FeedbackSnapshotType = SnapshotOut<typeof FeedbackModel>
export interface FeedbackSnapshot extends FeedbackSnapshotType {}
export const createFeedbackDefaultModel = () => types.optional(FeedbackModel, {})
