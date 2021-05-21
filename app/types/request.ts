import { UserID } from "./user"

/**
 * Statuses for a request
 */
export enum RequestStatusEnum {
  /** (Default) Request was submitted by the requester without a confirmation */
  REQUESTED = "REQUESTED",
  /** Request was matched to an available chaperone by a dispatcher and is scheduled to occur */
  SCHEDULED = "SCHEDULED",
  /** Request was rejected by the dispatcher with reason `requestStatusReason` */
  REJECTED = "REJECTED",
  /** Request was canceled by the requester and is no longer valid */
  CANCELED_BY_REQUESTER = "CANCELED_BY_REQUESTER",
  /** Request was canceled by the chaperone and is no longer valid */
  CANCELED_BY_CHAPERONE = "CANCELED_BY_CHAPERONE",
  /** Request was rescheduled by the requester, with the new record referenced by rescheduledRequestId */
  RESCHEDULED = "RESCHEDULED",
}

/**
 * Types for a request
 */
export enum RequestTypeEnum {
  /** (Default) Request was submitted by the requester without a type */
  UNKNOWN = "UNKNOWN",
  /** Request for a grocery store */
  GROCERY = "GROCERY",
  /** Request for a doctor visit */
  DOCTOR = "DOCTOR",
  /** Request for a walk */
  WALK = "WALK",
}

/**
 * @format uuid
 */
export type RequestID = string

/**
 * A Request represents an individual request by requesters to be fulfilled by chaperones. Created
 * when a request is made by the Requester and updated as the status changes up until it’s fulfilled
 * by a Session.
 *
 * @primaryKey id
 */
export interface Request {
  /**
   * Primary key
   */
  id: RequestID

  /**
   * @format date-time
   */
  createdAt: string

  /**
   * @format date-time
   */
  requestedAt: string

  /**
   * @format date-time
   */
  updatedAt: string

  /**
   * This should be a validated address string from the geocoder service and not freeform input
   */
  meetAddress: string

  /**
   * This should be a validated address string from the geocoder service and not freeform input
   */
  destinationAddress: string

  /**
   * Other comments text field
   */
  otherComments: string

  /**
   * Reason why the request is in the current status; mainly for rejections
   */
  requestStatusReason: string

  /**
   * Chaperones who are assigned to this request
   */
  chaperones: UserID[]

  /**
   * Status of the request
   */
  status: RequestStatusEnum

  /**
   * Pointer to the rescheduled request ID
   */
  rescheduledRequestId: RequestID

  /**
   * Type of request
   */
  type: RequestTypeEnum
}
