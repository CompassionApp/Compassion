import { format, parse } from "date-fns"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CALENDAR_DATE_FORMAT, TIME_RANGE_FORMAT } from "../../constants"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import { generateUuid } from "../../utils/uuid"
import { withAuthContext } from "../extensions/with-auth-context"
import {
  ChaperoneRequestModel,
  ChaperoneRequestSnapshot,
} from "../chaperone-request/chaperone-request"

/**
 * Model for where elements of a new request is staged as the user goes through the wizard and
 * before converting into a Request
 */
export const NewRequestStoreModel = types
  .model("NewRequestStore")
  .props({
    /** Time in format: h:mm a */
    requestedTime: types.maybe(types.string),
    /** Date in format: yyyy-mm-dd */
    requestedDate: types.maybe(types.string),
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
        self.requestedTime === undefined &&
        self.requestedDate === undefined &&
        self.meetAddress === undefined &&
        self.destinationAddress === undefined &&
        self.otherComments === undefined &&
        self.type === undefined
      )
    },

    /** Returns true if all steps have been completed */
    get isComplete() {
      return (
        self.requestedTime !== undefined &&
        self.requestedDate !== undefined &&
        self.meetAddress !== undefined &&
        self.destinationAddress !== undefined &&
        self.otherComments !== undefined &&
        self.type !== undefined
      )
    },

    get requestedAt() {
      try {
        return parse(
          `${self.requestedDate} ${self.requestedTime}`,
          `${CALENDAR_DATE_FORMAT} ${TIME_RANGE_FORMAT}`,
          new Date(),
        ).toUTCString()
      } catch (e) {
        return undefined
      }
    },
  }))
  .views((self) => ({
    /** Converts the staged new request into a new RequestModel */
    convertToRequest: () => {
      return ChaperoneRequestModel.create({
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
      self.requestedTime = undefined
      self.requestedDate = undefined
      self.meetAddress = undefined
      self.destinationAddress = undefined
      self.otherComments = undefined
      self.type = undefined
    },

    setRequestedTime: (value: string) => {
      self.requestedTime = value
    },

    setRequestedDate: (value: string) => {
      self.requestedDate = value
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
    replaceFromRequest: (request: ChaperoneRequestSnapshot) => {
      self.requestedDate = format(new Date(request.requestedAt), CALENDAR_DATE_FORMAT)
      self.requestedTime = format(new Date(request.requestedAt), TIME_RANGE_FORMAT)
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
