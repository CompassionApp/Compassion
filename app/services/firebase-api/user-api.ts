import { FirebaseCoreApiAdapter } from "./firebase-core-api"
import type { GetUserProfileResult, SaveUserProfileResult } from "./api.types"
import type { UserProfileSnapshot } from "../../models"
// import { typeConverter } from "./utils"

export class UserApi {
  private firebase: FirebaseCoreApiAdapter

  constructor(firebase: FirebaseCoreApiAdapter) {
    this.firebase = firebase
  }

  /**
   * Updates or creates a user profile at `/users/[key]` with the snapshot
   */
  async saveUserProfile(key: string, profile: any): Promise<SaveUserProfileResult> {
    try {
      console.log("[user-api] Saving user profile")
      await this.firebase.firestore.collection("users").doc(key).set(profile)

      return { kind: "ok" }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetches the user profile document at `/users/[key]`
   *
   * @param key Key for looking up the user
   * @param updateNotificationToken (Optional) Notification token to update the profile before a
   * read
   * @returns
   */
  async getUserProfile(
    key: string,
    updateNotificationToken?: string,
  ): Promise<GetUserProfileResult> {
    console.log("[user-api] Fetching user profile...")
    try {
      const userProfileDocRef = this.firebase.firestore.collection("users").doc(key)

      // Transactions require reads before writes, so we'll have to do just that:
      const userProfile = await this.firebase.firestore
        .runTransaction((transaction) => {
          return transaction.get(userProfileDocRef).then((userProfileDoc) => {
            const updatedUserProfile = userProfileDoc.data()
            if (updateNotificationToken) {
              console.log("[user-api] Updating notification token to", updateNotificationToken)
              updatedUserProfile.notificationToken = updateNotificationToken
              transaction.update(userProfileDocRef, updatedUserProfile)
            }
            return updatedUserProfile
          })
        })
        .catch((e) => {
          throw new Error(`[user-api] Get user profile failed: ${e.message}`)
        })
      return {
        kind: "ok",
        profile: userProfile as UserProfileSnapshot,
      }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
