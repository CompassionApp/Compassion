import firebase from "firebase"
import { RequestSnapshot, UserProfileSnapshot } from "../../models"
import { FirebaseAuthApiProblem, GeneralApiProblem } from "./api-problem"

/**
 * TODO: These are examples from the original ./app/services/api directory. Remove when ready
 */

export interface User {
  id: number
  name: string
}

export interface AuthContext {
  userId: string
}
export type GetUserProfileResult = { kind: "ok"; profile: UserProfileSnapshot } | GeneralApiProblem
export type SaveUserProfileResult = { kind: "ok" } | GeneralApiProblem
export type CreateRequestResult = { kind: "ok" } | GeneralApiProblem
export type GetRequestsResult = { kind: "ok"; requests: RequestSnapshot[] } | GeneralApiProblem
export type DeleteRequestResult = { kind: "ok" } | GeneralApiProblem
export type SignInResult =
  | { kind: "ok"; user: firebase.auth.UserCredential }
  | FirebaseAuthApiProblem
export type SignOutResult = { kind: "ok" } | FirebaseAuthApiProblem
export type CreateUserResult =
  | { kind: "ok"; user: firebase.auth.UserCredential }
  | FirebaseAuthApiProblem
