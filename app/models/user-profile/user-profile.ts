import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserRoleEnum, UserStatus } from "../../types"
import { withEnvironment } from "../extensions/with-environment"

/**
 * A `UserProfile` contains the extraneous attributes for a user that we care about in this app
 */
export const UserProfileModel = types
  .model("UserProfile")
  .props({
    createdAt: types.optional(types.string, new Date().toUTCString()),
    updatedAt: types.optional(types.string, new Date().toUTCString()),
    role: types.enumeration([UserRoleEnum.ADMIN, UserRoleEnum.CHAPERONE, UserRoleEnum.REQUESTER]),
    firstName: types.string,
    lastName: types.string,
    status: types.enumeration([UserStatus.ACTIVE, UserStatus.DISALLOW, UserStatus.INACTIVE]),
    latestCovidTestVerifiedAt: types.maybeNull(types.string),
    signedCodeOfConductAt: types.maybeNull(types.string),
    acceptedUserAgreementAt: types.maybeNull(types.string),
  })
  .extend(withEnvironment)

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type UserProfileType = Instance<typeof UserProfileModel>
export interface UserProfile extends UserProfileType {}
type UserProfileSnapshotType = SnapshotOut<typeof UserProfileModel>
export interface UserProfileSnapshot extends UserProfileSnapshotType {}
export const createUserProfileDefaultModel = () => types.optional(UserProfileModel, {})
