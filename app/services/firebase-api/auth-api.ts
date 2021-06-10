import { FirebaseApi } from "./firebase-api"
import { FirebaseError } from "firebase"
import { CreateUserResult, SignInResult, SignOutResult } from "./api.types"
import { getFirebaseAuthApiProblem } from "./api-problem"

/**
 * API wrapper for Firebase's authentication interface. Handles the user authentication and user
 * creation.
 */
export class AuthApi {
  private firebase: FirebaseApi

  constructor(firebase: FirebaseApi) {
    this.firebase = firebase
  }

  /**
   * Signs a user in
   */
  async signIn(userEmail: string, userPassword: string): Promise<SignInResult> {
    try {
      const user = await this.firebase.authentication.signInWithEmailAndPassword(
        userEmail,
        userPassword,
      )
      return { kind: "ok", user }
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
      const user = await this.firebase.authentication.createUserWithEmailAndPassword(
        userEmail,
        userPassword,
      )
      return { kind: "ok", user }
    } catch (e) {
      const error = <FirebaseError>e
      const problem = getFirebaseAuthApiProblem(error)

      __DEV__ && console.tron.log(problem)
      return problem
    }
  }
}
