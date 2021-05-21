import { Request } from "../../types"
import { GeneralApiProblem } from "./api-problem"

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
export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type CreateRequestResult = { kind: "ok"; request: Request } | GeneralApiProblem
export type GetRequestsResult = { kind: "ok"; requests: Request[] } | GeneralApiProblem
export type DeleteRequestResult = { kind: "ok" } | GeneralApiProblem
