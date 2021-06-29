import { cast, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { UserProfileModel, UserProfileSnapshot } from "../user-profile/user-profile"

/**
 * Represents a user with attributes picked from Firebase Auth's user profile. Also includes a
 * `profile` which is synced to a document containing all of the user's metadata for Compassion
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.identifier,
    email: types.maybeNull(types.string),
    profile: types.maybe(UserProfileModel),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    /**
     * Sets the user profile locally
     */
    _replaceUserProfile: (userProfile: UserProfileSnapshot) => {
      self.profile = cast(userProfile)
    },

    /**
     * Saves the user profile document on Firestore with the data from the local store
     */
    save: flow(function* () {
      if (self.profile) {
        self.profile.save()
      }
    }),

    /**
     * Fetches the user profile document from Firestore and attaches it to the user model.
     * Optionally, updates the notification token and lastLoginAt fields
     */
    fetchUserProfile: flow(function* (notificationToken?: string, lastLoginAt?: string) {
      console.log(`[user] Fetching user profile for ${self.email}...`)

      // Check if the user profile document exists
      const { profile } = yield self.environment.userApi.getUserProfile(
        self.email,
        notificationToken,
        lastLoginAt,
      )

      console.log("[user] Fetched profile:", profile)
      self.profile = UserProfileModel.create(profile)
    }),
  }))
  .actions((self) => ({
    acceptUserAgreement: () => {
      self.profile.acceptUserAgreement()
      self.save()
    },

    setToken: (token: string | null) => {
      self.profile.setNotificationToken(token)
      self.save()
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
