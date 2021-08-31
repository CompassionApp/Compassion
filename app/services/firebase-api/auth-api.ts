import firebase from "firebase"
import { FirebaseCoreApiAdapter } from "./firebase-core-api"
import { CreateUserResult, SignInResult, SignOutResult, UpdatePasswordResult, UpdateUserResult } from "./api.types"
import { getFirebaseAuthApiProblem } from "./api-problem"

/**
 * API wrapper for Firebase's authentication interface. Handles the user authentication and user
 * creation.
 */
export class AuthApi {
  private firebase: FirebaseCoreApiAdapter

  constructor(firebase: FirebaseCoreApiAdapter) {
    this.firebase = firebase
  }

  /**
   * Returns the current logged in Firebase User
   */
  get currentUser(): firebase.User {
    return this.firebase.authentication.currentUser
  }

  /**
   * Signs a user in
   */
  async signIn(userEmail: string, userPassword: string): Promise<SignInResult> {
    try {
      const userCredential = await this.firebase.authentication.signInWithEmailAndPassword(
        userEmail,
        userPassword,
      )
      return { kind: "ok", userCredential }
    } catch (e) {
      const error = <firebase.FirebaseError>e
      const problem = getFirebaseAuthApiProblem(error)

      __DEV__ && console.tron.log(problem)
      return problem
    }
  }

  /**
   * Signs a user out
   */
  async signOut(): Promise<SignOutResult> {
    try {
      await this.firebase.authentication.signOut()
      return { kind: "ok" }
    } catch (e) {
      const error = <firebase.FirebaseError>e
      const problem = getFirebaseAuthApiProblem(error)

      __DEV__ && console.tron.log(problem)
      return problem
    }
  }

  /**
   * Creates a new user and creates the initial user profile
   */
  async createUser(userEmail: string, userPassword: string): Promise<CreateUserResult> {
    try {
      const userCredential = await this.firebase.authentication.createUserWithEmailAndPassword(
        userEmail,
        userPassword,
      )
      return { kind: "ok", userCredential }
    } catch (e) {
      const error = <firebase.FirebaseError>e
      const problem = getFirebaseAuthApiProblem(error)

      __DEV__ && console.tron.log(problem)
      return problem
    }
  }

  /**
   * Updates the current user's Firebase auth profile
   */
  async updateFirebaseUser(user: firebase.User): Promise<UpdateUserResult> {
    try {
      console.log("[auth-api] Updating Firebase user")
      await this.firebase.authentication.updateCurrentUser(user)
      console.log("[auth-api] Success updating", this.firebase.authentication.currentUser)
      return { kind: "ok" }
    } catch (e) {
      const error = <firebase.FirebaseError>e
      const problem = getFirebaseAuthApiProblem(error)

      __DEV__ && console.tron.log(problem)
      return problem
    }
  }

  /**
   * Updates the current user's Firebase password
   *
   * This article helped me figure out how to get updatePassword() to work properly
   * https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
   */
  async updateFirebaseUserPassword(oldPassword: string, newPassword: string): Promise<UpdatePasswordResult> {
    try {
      const user = firebase.auth().currentUser
      const cred = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword)

      await user.reauthenticateWithCredential(cred)
      await user.updatePassword(newPassword)

      return { kind: "ok" }
    } catch (e) {
      const error = <firebase.FirebaseError>e

      __DEV__ && console.tron.log(error)
      return { kind: error }
    }
  }
}
