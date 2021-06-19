import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import { generateUuid } from "../../utils/uuid"
import { withAuthContext } from "../extensions/with-auth-context"
import { RequestModel, RequestSnapshot } from "../request/request"

/**
 * Model for where elements of a new request is staged as the user goes through the wizard and
 * before converting into a Request
 */
export const NewRequestStoreModel = types
  .model("NewRequestStore")
  .props({
    requestedAt: types.maybe(types.string),
    meetAddress: types.maybe(types.string),
    destinationAddress: types.maybe(types.string),
    otherComments: types.maybe(types.string),
    type: types.maybe(types.enumeration<RequestTypeEnum>(Object.values(RequestTypeEnum))),
  })
  .extend(withAuthContext)
  .views((self) => ({
    /** Returns true if the new request is in its pristine state */
    get isClean() {
      return (
        self.requestedAt === undefined &&
        self.meetAddress === undefined &&
        self.destinationAddress === undefined &&
        self.otherComments === undefined &&
        self.type === undefined
      )
    },

    /** Returns true if all steps have been completed */
    get isComplete() {
      return (
        self.requestedAt !== undefined &&
        self.meetAddress !== undefined &&
        self.destinationAddress !== undefined &&
        self.otherComments !== undefined &&
        self.type !== undefined
      )
    },

    /** Converts the staged new request into a new RequestModel */
    convertToRequest: () => {
      return RequestModel.create({
        id: generateUuid(),
        status: RequestStatusEnum.REQUESTED,
        requestedBy: self.authContext.profile.preview,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        chaperones: [],
        requestStatusReason: "",
        requestedAt: self.requestedAt,
        meetAddress: self.meetAddress,
        destinationAddress: self.destinationAddress,
        otherComments: self.otherComments,
        type: self.type,
      })
    },
  }))
  .actions((self) => ({
    /** Clears the new request. Call after converting to a Request */
    reset: () => {
      self.requestedAt = undefined
      self.meetAddress = undefined
      self.destinationAddress = undefined
      self.otherComments = undefined
      self.type = undefined
    },

    setRequestedAt: (value: string) => {
      self.requestedAt = value
    },

    setMeetAddress: (value: string) => {
      self.meetAddress = value
    },

    setDestinationAddress: (value: string) => {
      self.destinationAddress = value
    },

    setOtherComments: (value: string) => {
      self.otherComments = value
    },

    setType: (value: RequestTypeEnum) => {
      self.type = value
    },

    /** Overwrites the current new request with a RequestSnapshot as the seed. Useful for
     * rescheduling. */
    replaceFromRequest: (request: RequestSnapshot) => {
      self.requestedAt = request.requestedAt
      self.meetAddress = request.meetAddress
      self.destinationAddress = request.destinationAddress
      self.otherComments = request.otherComments
      self.type = request.type
    },
  }))

type NewRequestStoreType = Instance<typeof NewRequestStoreModel>
export interface NewRequestStore extends NewRequestStoreType {}
type NewRequestStoreSnapshotType = SnapshotOut<typeof NewRequestStoreModel>
export interface NewRequestStoreSnapshot extends NewRequestStoreSnapshotType {}
export const createNewRequestStoreDefaultModel = () =>
  types.optional(NewRequestStoreModel, {} as any)
