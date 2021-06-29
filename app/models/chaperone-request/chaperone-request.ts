import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { MAX_CHAPERONES_PER_REQUEST } from "../../constants/match"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import {
  UserProfilePreview,
  UserProfilePreviewModel,
} from "../user-profile-preview/user-profile-preview"

/**
 * A ChaperoneRequest represents an individual request by requesters to be fulfilled by chaperones. Created
 * when a request is made by the Requester and updated as the status changes up until it’s fulfilled
 * by a Session.
 */
export const ChaperoneRequestModel = types
  .model("ChaperoneRequest")
  .props({
    id: types.identifier,
    /** User key of the requester */
    requestedBy: UserProfilePreviewModel,
    /** When the request was created */
    createdAt: types.string,
    /** Requested time for the chaperone session */
    requestedAt: types.maybe(types.string),
    updatedAt: types.maybe(types.string),
    meetAddress: types.maybe(types.string),
    destinationAddress: types.maybe(types.string),
    /** Other comments text field */
    otherComments: types.maybe(types.string),
    requestStatusReason: types.maybe(types.string),
    chaperones: types.optional(types.array(UserProfilePreviewModel), []),
    /** Status of the request */
    status: types.maybe(types.enumeration<RequestStatusEnum>(Object.values(RequestStatusEnum))),
    /** Type of request */
    type: types.maybe(types.enumeration<RequestTypeEnum>(Object.values(RequestTypeEnum))),
  })
  .views((self) => ({
    containsUserAsChaperone: (email: string) => {
      return self.chaperones.find((chaperone) => chaperone.email === email)
    },
  }))
  .actions((self) => ({
    touchUpdatedDate: () => {
      self.updatedAt = new Date().toUTCString()
    },
    addChaperone: (previewProfile: UserProfilePreview) => {
      if (self.chaperones.length + 1 > MAX_CHAPERONES_PER_REQUEST) {
        throw new Error("Too many chaperones")
      }
      self.chaperones.push(previewProfile)
    },
    /** Removes a chaperone from the request */
    removeChaperone: (email: string) => {
      const index = self.chaperones.findIndex((chaperone) => chaperone.email === email)
      if (index < 0) return
      self.chaperones.remove(self.chaperones[index])
    },
    setStatus: (status: RequestStatusEnum) => {
      self.status = status
    },
  }))

type ChaperoneRequestType = Instance<typeof ChaperoneRequestModel>
export interface ChaperoneRequest extends ChaperoneRequestType {}
type ChaperoneRequestSnapshotType = SnapshotOut<typeof ChaperoneRequestModel>
export interface ChaperoneRequestSnapshot extends ChaperoneRequestSnapshotType {}
export const createRequestDefaultModel = () => types.optional(ChaperoneRequestModel, {})