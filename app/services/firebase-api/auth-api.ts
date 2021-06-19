import firebase, { FirebaseError } from "firebase"
import { FirebaseCoreApiAdapter } from "./firebase-core-api"
import { CreateUserResult, SignInResult, SignOutResult, UpdateUserResult } from "./api.types"
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
      const error = <FirebaseError>e
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
      const error = <FirebaseError>e
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
      const error = <FirebaseError>e
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
      const error = <FirebaseError>e
      const problem = getFirebaseAuthApiProblem(error)

      __DEV__ && console.tron.log(problem)
      return problem
    }
  }
}
