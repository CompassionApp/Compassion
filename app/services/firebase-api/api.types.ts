import firebase from "firebase"
import { RequestSnapshot, User, UserProfileSnapshot } from "../../models"
import { FirebaseAuthApiProblem, GeneralApiProblem } from "./api-problem"

export interface AuthContext extends User {}
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
