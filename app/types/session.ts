import { RequestID } from "./request"
import { UserID } from "./user"

/**
 * Session statuses
 */
export enum SessionStatusEnum {
  AWAITING_START = "AWAITING_START",
  STARTED = "STARTED",
  ENDED = "ENDED",
}

/**
 * @format uuid
 */
export type SessionID = string

/**
 * Historical chaperone sessions. Row created as soon as a session has been started
 */
export interface Session {
  /**
   * Primary key
   */
  id: SessionID

  /**
   * @format date-time
   */
  createdAt: string

  /**
   * @format date-time
   */
  startedAt: string

  /**
   * @format date-time
   */
  endedAt: string

  /**
   * Status of the session
   */
  status: SessionStatusEnum

  /**
   * Chaperone(s) serving the session
   */
  chaperone: UserID[]

  /**
   * Requester for session
   */
  requesterId: UserID

  /**
   * Request ID for the session
   */
  requestId: RequestID
}
