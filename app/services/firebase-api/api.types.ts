import firebase from "firebase"
import type { NotificationSnapshot, RequestSnapshot, User, UserProfileSnapshot } from "../../models"
import { FirebaseAuthApiProblem, GeneralApiProblem } from "./api-problem"

export interface AuthContext extends User {}
export type GetUserProfileResult = { kind: "ok"; profile: UserProfileSnapshot } | GeneralApiProblem
export type GetAllUserProfilesResult =
  | { kind: "ok"; profiles: UserProfileSnapshot[] }
  | GeneralApiProblem
export type SaveUserProfileResult = { kind: "ok" } | GeneralApiProblem
export type NotifyAllChaperonesResult = { kind: "ok" } | GeneralApiProblem
export type ClearAllNotificationsResult = { kind: "ok" } | GeneralApiProblem
export type NotifyUserResult = { kind: "ok" } | GeneralApiProblem
export type GetUserNotificationsResult =
  | { kind: "ok"; notifications: NotificationSnapshot[] }
  | GeneralApiProblem
export type CreateRequestResult = { kind: "ok" } | GeneralApiProblem
export type GetRequestsResult = { kind: "ok"; requests: RequestSnapshot[] } | GeneralApiProblem
export type DeleteRequestResult = { kind: "ok" } | GeneralApiProblem
export type UpdateRequestResult = { kind: "ok" } | GeneralApiProblem
export type SignInResult =
  | { kind: "ok"; userCredential: firebase.auth.UserCredential }
  | FirebaseAuthApiProblem
export type SignOutResult = { kind: "ok" } | FirebaseAuthApiProblem
export type CreateUserResult =
  | { kind: "ok"; userCredential: firebase.auth.UserCredential }
  | FirebaseAuthApiProblem
export type UpdateUserResult = { kind: "ok" } | FirebaseAuthApiProblem
