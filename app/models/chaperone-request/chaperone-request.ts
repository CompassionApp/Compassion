import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { MAX_CHAPERONES_PER_REQUEST } from "../../constants/match"
import { RequestStatusEnum, RequestActivityEnum } from "../../types"
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
    /** Activity for request */
    activity: types.maybe(
      types.enumeration<RequestActivityEnum>(Object.values(RequestActivityEnum)),
    ),
  })
  .views((self) => ({
    /** Returns `true` if the request has been canceled */
    get isCanceled() {
      return (
        self.status === RequestStatusEnum.CANCELED_BY_CHAPERONE ||
        self.status === RequestStatusEnum.CANCELED_BY_REQUESTER
      )
    },

    /** Returns `true` if the request has been scheduled */
    get isScheduled() {
      return self.status === RequestStatusEnum.SCHEDULED
    },

    containsUserAsChaperone: (email: string) => {
      return self.chaperones.find((chaperone) => chaperone.email === email)
    },

    /** Returns `true` if the request is assigned to the user, either as a requester or as one of
     * the chaperone(s). Useful to selectively rendering matched attributes. */
    isAssignedToUser: (email: string) =>
      [self.requestedBy.email, ...self.chaperones.map(({ email }) => email)].includes(email),
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
