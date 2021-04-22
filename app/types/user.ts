/**
 * User statuses
 */
export enum UserStatus {
  /** Active user */
  ACTIVE = "ACTIVE",
  /** Inactive user */
  INACTIVE = "INACTIVE",
  /** Disallowed from the app; unable to the use the app or our services */
  DISALLOW = "DISALLOW",
}

/**
 * Roles for a User
 */
export enum UserRoleEnum {
  /** An administrator is someone who can view all the active sessions, reassign chaperones, and schedule requests */
  ADMIN = "ADMIN",
  CHAPERONE = "CHAPERONE",
  REQUESTER = "REQUESTER",
}

/**
 * @format uuid
 */
export type UserID = string

/**
 * @primaryKey id
 */
export interface User {
  /**
   * Primary key
   */
  id: UserID

  /**
   * Firebase auth user ID
   */
  firebaseUserId: string

  /**
   * @format date-time
   */
  createdAt: string

  /**
   * @format date-time
   */
  updatedAt: string

  /**
   * Active role for user
   */
  role: UserRoleEnum

  /**
   * @minLength 5
   * @maxLength 60
   * @format email
   */
  email: string

  /**
   * @minLength 7
   * @maxLength 20
   */
  password: string

  /**
   * @minLength 1
   * @maxLength 65
   */
  firstName: string

  /**
   * @minLength 1
   * @maxLength 65
   */
  lastName: string

  /**
   * @minimum 1000000000
   * @maximum 9999999999
   * @type integer
   */
  phoneNumber: number

  /**
   * User status
   */
  status: UserStatus

  /**
   * Last known verified COVID test
   *
   * @format date-time
   */
  latestCovidTestVerifiedAt: string

  /**
   * Date of signed code of conduct
   *
   * @format date-time
   */
  signedCodeOfConductAt: string
}
