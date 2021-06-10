import { flow, Instance, SnapshotOut, types, getSnapshot } from "mobx-state-tree"
import { UserApi } from "../../services/firebase-api/user-api"
import { withEnvironment } from "../extensions/with-environment"
import { UserProfileModel } from "../user-profile/user-profile"

/**
 * Represents a user with attributes picked from Firebase Auth's user profile. Also includes a
 * `profile` which is synced to a document containing all of the user's metadata for Compassion
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.identifier,
    email: types.maybeNull(types.string),
    displayName: types.maybeNull(types.string),
    phoneNumber: types.maybeNull(types.string),
    photoURL: types.maybeNull(types.string),
    emailVerified: types.boolean,
    profile: types.maybe(UserProfileModel),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    /**
     * Updates Firebase with the user profile in the local store
     */
    updateUserProfile: flow(function* () {
      const userApi = new UserApi(self.environment.firebaseApi)
      console.log("[user] Updating user profile...")
      self.profile.updatedAt = new Date().toUTCString()
      yield userApi.saveUserProfile(self.email, getSnapshot(self.profile))
    }),

    /**
     * Fetches the user profile document from Firestore and attaches it to the user model
     *
     * Firestore path: `users/[email]`
     */
    fetchUserProfile: flow(function* () {
      const userApi = new UserApi(self.environment.firebaseApi)
      console.log(`[user] Fetching user profile for ${self.email}...`)

      // Check if the user profile document exists
      const { profile } = yield userApi.getUserProfile(self.email)

      console.log("[user] Fetched profile:", profile)
      self.profile = UserProfileModel.create(profile)
    }),
  }))
  .actions((self) => ({
    acceptUserAgreement: () => {
      self.profile.acceptedUserAgreementAt = new Date().toUTCString()
      self.updateUserProfile()
    },
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
