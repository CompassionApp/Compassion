import firebase from "firebase"
import { destroy, flow, getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { AuthApi } from "../../services/firebase-api/auth-api"
import { UserModel } from "../user/user"
import { UserRoleEnum, UserStatus } from "../../types"
import { UserProfileModel, UserProfileSnapshot } from "../user-profile/user-profile"
import { UserApi } from "../../services/firebase-api/user-api"

/**
 * Authentication store - use this store for any actions related to authentication, e.g.
 * registration, login, reset password
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    user: types.maybe(UserModel),
  })
  .extend(withEnvironment)
  .views((self) => ({
    /** Returns true if the user logged in */
    isLoggedIn: () => !!self.user,
  }))
  .actions((self) => ({
    /**
     * Sets the local auth store user details from the UserCredential returned from the sign in
     * process
     */
    setUserFromCredential: flow(function* (
      userCredential: firebase.auth.UserCredential,
      profile?: UserProfileSnapshot,
    ) {
      // Delete the old user node
      if (self.user) destroy(self.user)
      const { uid, email, displayName, phoneNumber, photoURL, emailVerified } = userCredential.user
      self.user = UserModel.create({
        id: uid,
        email,
        displayName,
        phoneNumber,
        photoURL,
        emailVerified,
        profile: profile,
      })

      if (!profile) {
        console.log(`[setUserFromCredential] No profile provided, so calling fetchUserProfile`)
        yield self.user.fetchUserProfile()
      }
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
      const authApi = new AuthApi(self.environment.firebaseApi)
      const userApi = new UserApi(self.environment.firebaseApi)
      console.log("[auth-store] Creating user with", {
        userEmail,
        userPassword,
        firstName,
        lastName,
      })
      const {
        kind,
        user: firebaseUser,
      }: { kind: string; user: firebase.auth.UserCredential } = yield authApi.createUser(
        userEmail,
        userPassword,
      )
      if (kind !== "ok") {
        throw new Error(kind)
      }
      // Creating a new user profile with defaults to save to Firestore
      const profile = UserProfileModel.create({
        firstName,
        lastName,
        role,
        status: UserStatus.ACTIVE,
      })
      yield userApi.saveUserProfile(userEmail, getSnapshot(profile))
      console.log("[auth-store] New user profile created in Firestore", getSnapshot(profile))

      yield self.setUserFromCredential(firebaseUser, profile)
    }),

    /**
     * Signs in a user
     */
    signIn: flow(function* (userEmail: string, userPassword: string) {
      const authApi = new AuthApi(self.environment.firebaseApi)
      const result = yield authApi.signIn(userEmail, userPassword)
      if (result.kind === "ok") {
        const { user } = result
        yield self.setUserFromCredential(user)
      } else {
        throw new Error(result.kind)
      }
    }),

    /**
     * Signs a user out and deletes the `user` from the model
     */
    signOut: flow(function* () {
      console.log("Signing out user", self.user?.email)
      const authApi = new AuthApi(self.environment.firebaseApi)
      if (!self.environment.firebaseApi.authentication.currentUser) {
        console.log("[signOut] No current user, ignoring Firebase auth signout")
      } else {
        yield authApi.signOut()
      }
      if (self.user) destroy(self.user)
      const store = self.environment.getStore()
      store.requestStore.clear()
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
