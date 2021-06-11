import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { MAX_CHAPERONES_PER_REQUEST } from "../../constants/match"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"

/**
 * A Request represents an individual request by requesters to be fulfilled by chaperones. Created
 * when a request is made by the Requester and updated as the status changes up until it’s fulfilled
 * by a Session.
 */
export const RequestModel = types
  .model("Request")
  .props({
    id: types.identifier,
    requestedBy: types.string,
    createdAt: types.string,
    requestedAt: types.maybe(types.string),
    updatedAt: types.maybe(types.string),
    meetAddress: types.maybe(types.string),
    destinationAddress: types.maybe(types.string),
    otherComments: types.maybe(types.string),
    requestStatusReason: types.maybe(types.string),
    chaperones: types.optional(types.array(types.string), []),
    status: types.maybe(types.string),
    type: types.maybe(types.string),
  })
  .views((self) => ({
    containsUserAsChaperone: (userId: string) => {
      return self.chaperones.includes(userId)
    },
  }))
  .actions((self) => ({
    touchUpdatedDate: () => {
      self.updatedAt = new Date().toUTCString()
    },
    addChaperone: (userId: string) => {
      if (self.chaperones.length + 1 > MAX_CHAPERONES_PER_REQUEST) {
        throw new Error("Too many chaperones")
      }
      self.chaperones.push(userId)
    },
    removeChaperone: (userId: string) => {
      self.chaperones.remove(userId)
    },
    setStatus: (status: RequestStatusEnum) => {
      self.status = status
    },
    setRequestDateTime: (dateStr: string) => {
      self.requestedAt = dateStr
    },
    setMeetLocation: (meetAddress: string) => {
      self.meetAddress = meetAddress
    },
    setDestinationLocation: (destinationAddress: string) => {
      self.destinationAddress = destinationAddress
    },
    setActivity: (activity: RequestTypeEnum) => {
      self.type = activity
    },
    setNotes: (notes: string) => {
      self.otherComments = notes
    },
  }))

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
