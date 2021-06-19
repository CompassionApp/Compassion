import firebase from "firebase"
import { destroy, flow, getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { UserModel } from "../user/user"
import { UserRoleEnum, UserStatusEnum } from "../../types"
import { UserProfileModel } from "../user-profile/user-profile"

/**
 * Authentication store - use this store for any actions related to authentication, e.g.
 * registration, login, reset password
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    /**
     * User model of the logged in user containing key identifiers
     */
    user: types.maybe(UserModel),
  })
  .extend(withEnvironment)
  .views((self) => ({
    /** Returns true if the user logged in */
    isLoggedIn: () => !!self.user,
  }))
  .actions((self) => ({
    /**
     * Populates the local auth store `user` from the UserCredential returned from the sign in/sign
     * up process
     */
    updateLocalUserDetailsFromFirebase: flow(function* (user: firebase.User) {
      // Delete the old user node if it exists
      if (self.user) destroy(self.user)

      // Append a notification token, if applicable
      const { uid, email } = user
      self.user = UserModel.create({
        id: uid,
        email,
      })
    }),
  }))
  .actions((self) => ({
    /**
     * Registers a new user in Firebase, creates a new user profile, and signs in
     *
     * Firestore path: `users/[email]`
     */
    createUser: flow(function* (
      userEmail: string,
      userPassword: string,
      firstName: string,
      lastName: string,
      role: UserRoleEnum,
    ) {
      console.log("[auth-store] Creating user with", {
        userEmail,
        userPassword,
        firstName,
        lastName,
      })
      const {
        kind,
        userCredential,
      }: {
        kind: string
        userCredential: firebase.auth.UserCredential
      } = yield self.environment.authApi.createUser(userEmail, userPassword)
      if (kind === "bad") {
        throw new Error(kind)
      }

      const user = userCredential.user
      // Update the Firebase Auth profile with the name
      yield self.environment.authApi.updateFirebaseUser({
        ...user,
        displayName: `${firstName} ${lastName}`,
      })
      // Populate app's /auth/user
      yield self.updateLocalUserDetailsFromFirebase(user)

      // Creating a new user profile with defaults to save to Firestore
      const profile = UserProfileModel.create({
        id: user.uid,
        firstName,
        lastName,
        role,
        email: userEmail,
        status: UserStatusEnum.ACTIVE,
        phoneNumber: user.phoneNumber,
        createdAt: user.metadata.creationTime,
        // Register a notification token upon sign-up
        notificationToken: self.environment.notifications.deviceNotificationToken,
      })
      self.user.setUserProfile(getSnapshot(profile))
      yield self.user.save()
      console.log(
        "[auth-store] New user profile successfully created in Firestore",
        getSnapshot(profile),
      )
    }),

    /**
     * Signs in a user
     */
    signIn: flow(function* (userEmail: string, userPassword: string) {
      const {
        kind,
        userCredential,
      }: {
        kind: string
        userCredential: firebase.auth.UserCredential
      } = yield self.environment.authApi.signIn(userEmail, userPassword)
      if (kind === "ok") {
        const { user } = userCredential
        yield self.updateLocalUserDetailsFromFirebase(user)
        // Update the user profile's notification token and fetch the updated profile
        yield self.user.fetchUserProfile(self.environment.notifications.deviceNotificationToken)
      } else {
        throw new Error(kind)
      }
    }),

    /**
     * Signs a user out and deletes the `user` from the model
     */
    signOut: flow(function* () {
      console.log("[auth-store] Signing out user", self.user?.email)
      if (!self.environment.firebaseApi.authentication.currentUser) {
        console.log("[signOut] No current user, ignoring Firebase auth signout")
      } else {
        yield self.environment.authApi.signOut()
      }
      if (self.user) destroy(self.user)
      const store = self.environment.getStore()
      store.requestStore.clear()
    }),

    /**
     * [UNUSED] Updates the Firebase user details
     */
    updateFirebaseUser: flow(function* (displayName: string, phoneNumber: string) {
      console.log("[auth-store] Updating user", self.user?.email)
      const user = self.environment.authApi.currentUser
      user.displayName = displayName
      user.phoneNumber = phoneNumber
      console.log("[auth-store] updating to...", user)

      const { kind }: { kind: string } = yield self.environment.authApi.updateFirebaseUser(user)
      if (kind === "ok") {
        yield self.updateLocalUserDetailsFromFirebase(user)
      } else {
        throw new Error(kind)
      }
    }),
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}
export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
