import { ApiResponse } from "apisauce"
import firebase from "firebase"

/**
 * TODO: These are examples from the original ./app/services/api directory. Remove when ready
 */

export type GeneralApiProblem =
  /**
   * Times up.
   */
  | { kind: "timeout"; temporary: true }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: "cannot-connect"; temporary: true }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: "server" }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: "unauthorized" }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: "forbidden" }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: "not-found" }
  /**
   * All other 4xx series errors.
   */
  | { kind: "rejected" }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: "unknown"; temporary: true }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: "bad-data" }

export enum FirebaseAuthApiProblemType {
  /* Thrown if the email address is not valid. */
  INVALID_EMAIL = "Invalid email. Please try again.",
  /* Thrown if the user corresponding to the given email has been disabled. */
  USER_DISABLED = "User has been disabled",
  /* Thrown if there is no user corresponding to the given email. */
  USER_NOT_FOUND = "User not found",
  /* Thrown if the password is invalid for the given email, or the account corresponding to the email does not have a password set. */
  WRONG_PASSWORD = "Password incorrect. Please try again.",
  /* Thrown if the email is already in use */
  EMAIL_IN_USE = "Email in already in use. Try another.",
  UNKNOWN = "Error while signing in",
}
export type FirebaseAuthApiProblem = { kind: FirebaseAuthApiProblemType }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<any>): GeneralApiProblem | void {
  switch (response.problem) {
    case "CONNECTION_ERROR":
      return { kind: "cannot-connect", temporary: true }
    case "NETWORK_ERROR":
      return { kind: "cannot-connect", temporary: true }
    case "TIMEOUT_ERROR":
      return { kind: "timeout", temporary: true }
    case "SERVER_ERROR":
      return { kind: "server" }
    case "UNKNOWN_ERROR":
      return { kind: "unknown", temporary: true }
    case "CLIENT_ERROR":
      switch (response.status) {
        case 401:
          return { kind: "unauthorized" }
        case 403:
          return { kind: "forbidden" }
        case 404:
          return { kind: "not-found" }
        default:
          return { kind: "rejected" }
      }
    case "CANCEL_ERROR":
      return null
  }

  return null
}

export function getFirebaseAuthApiProblem(error: firebase.FirebaseError): FirebaseAuthApiProblem {
  switch (error.code) {
    case "auth/invalid-email":
      return { kind: FirebaseAuthApiProblemType.INVALID_EMAIL }
    case "auth/user-disabled":
      return { kind: FirebaseAuthApiProblemType.USER_DISABLED }
    case "auth/user-not-found":
      return { kind: FirebaseAuthApiProblemType.USER_NOT_FOUND }
    case "auth/wrong-password":
      return { kind: FirebaseAuthApiProblemType.WRONG_PASSWORD }
    case "auth/email-already-in-use":
      return { kind: FirebaseAuthApiProblemType.EMAIL_IN_USE }
    default:
      return { kind: FirebaseAuthApiProblemType.UNKNOWN }
  }
}
