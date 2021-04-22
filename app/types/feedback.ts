import { SessionID } from "./session"
import { UserID } from "./user"

/**
 * Feedback source (general feedback from the app or from a session)
 */
export enum FeedbackTypeEnum {
  /** General feedback */
  GENERAL_FEEDBACK = "GENERAL_FEEDBACK",
  /** Feedback for a session */
  SESSION_FEEDBACK = "SESSION_FEEDBACK",
}

/**
 * @format uuid
 */
export type FeedbackID = string

/**
 * Feedback submitted by either chaperones or requesters at the end of a session
 */
export interface Feedback {
  /**
   * Primary key
   */
  id: FeedbackID

  /**
   * @format date-time
   */
  createdAt: string

  /**
   * User who submitted the feedback
   */
  submittedBy: UserID

  /**
   * Optional field for the request tied to the feedback.
   */
  sessionID?: SessionID

  /**
   * Feedback type
   */
  type: FeedbackTypeEnum

  /**
   * (Optional) Freeform comments
   */
  comments?: string
}
