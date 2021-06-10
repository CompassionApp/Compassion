import { FirebaseApi } from "./firebase-api"
import { GetUserProfileResult, SaveUserProfileResult } from "./api.types"
import { typeConverter } from "./utils"
import { UserProfileSnapshot } from "../../models"

export class UserApi {
  private firebase: FirebaseApi

  constructor(firebase: FirebaseApi) {
    this.firebase = firebase
  }

  /**
   * Updates or creates a user profile at `/users/[key]` with the snapshot
   */
  async saveUserProfile(key: string, profile: UserProfileSnapshot): Promise<SaveUserProfileResult> {
    try {
      // const batch = this.firebase.firestore.batch()
      await this.firebase.firestore.collection("users").doc(key).set(profile)

      return { kind: "ok" }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetches the user profile document at `/users/[key]`
   */
  async getUserProfile(key: string): Promise<GetUserProfileResult> {
    try {
      const result = await this.firebase.firestore
        .collection("users")
        .doc(key)
        .withConverter(typeConverter<UserProfileSnapshot>())
        .get()

      if (!result.exists) {
        throw new Error(`[user-api] User profile for ${key} does not exist!`)
      }

      return {
        kind: "ok",
        profile: result.data() as UserProfileSnapshot,
      }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
