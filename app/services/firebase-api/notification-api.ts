import { FirebaseCoreApiAdapter } from "./firebase-core-api"
import type {
  AuthContext,
  ClearAllNotificationsResult,
  GetUserNotificationsResult,
  NotifyAllChaperonesResult,
  NotifyUserResult,
} from "./api.types"
import type { NotificationSnapshot, UserProfileSnapshot } from "../../models"
import { typeConverter } from "./utils"
import { UserRoleEnum, UserStatusEnum } from "../../types"
import { PushNotificationsService } from "../push-notifications"
import firebase from "firebase"

/**
 * Handles CRUD operations for notification documents in Firestore and sending the push notifications
 */
export class NotificationApi {
  private firebase: FirebaseCoreApiAdapter
  private pushNotificationsService: PushNotificationsService

  constructor(
    firebase: FirebaseCoreApiAdapter,
    pushNotificationsService: PushNotificationsService,
  ) {
    this.firebase = firebase
    this.pushNotificationsService = pushNotificationsService
  }

  /**
   * Subscribes to user's notifications
   */
  subscribeToUserNotifications(
    authContext: AuthContext,
    onSnapshot?: (notifications: NotificationSnapshot[]) => void,
  ) {
    // TODO: Bug. App crashes here when the user loses auth context
    if (!authContext?.email) {
      return undefined
    }

    console.log(`[notification-api] Subscribing to user notifications...`)
    return this.firebase.firestore
      .collection("users")
      .doc(authContext.email)
      .collection("notifications")
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const notifications: NotificationSnapshot[] = []
        querySnapshot.forEach((doc) => {
          notifications.push(doc.data() as NotificationSnapshot)
        })
        onSnapshot(notifications)
      })
  }

  /**
   * Fetches notifications for a particular user
   */
  async getNotificationsForUser(authContext: AuthContext): Promise<GetUserNotificationsResult> {
    try {
      console.log("[notification-api] Fetching user's notifications")

      const notifications: NotificationSnapshot[] = []
      const querySnapshot = await this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("notifications")
        .withConverter(typeConverter<NotificationSnapshot>())
        .get()

      // console.log("[notification-api] docs found", querySnapshot)
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data() as NotificationSnapshot)
      })
      console.log(`[notification-api] Found ${notifications.length}`)
      return { kind: "ok", notifications }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Notifies all active chaperones
   */
  async notifyAllChaperones(
    notification: NotificationSnapshot,
  ): Promise<NotifyAllChaperonesResult> {
    console.log("[notification-api] Notifying all chaperones...")
    try {
      // 1: Get a list of all the available chaperones
      const availableChaperonesQuery = await this.firebase.firestore
        .collection("users")
        .where("enableNotifications", "==", true)
        .where("role", "==", UserRoleEnum.CHAPERONE)
        .where("status", "==", UserStatusEnum.ACTIVE)
        .get()
      const availableChaperones: UserProfileSnapshot[] = []
      availableChaperonesQuery.forEach((doc) => {
        availableChaperones.push(doc.data() as UserProfileSnapshot)
      })
      const availableChaperoneUserKeys = availableChaperones.map((userProfile) => userProfile.email)
      const availableChaperoneNotificationTokens = availableChaperones.map(
        (userProfile) => userProfile.notificationToken,
      )
      console.log("[notification-api] Sending notifications to", availableChaperoneUserKeys)

      // 2: Schedule a batch write of a notification for every available chaperone
      const batch = this.firebase.firestore.batch()
      const chaperoneNotificationsDocRefs = availableChaperoneUserKeys.map((userKey) => {
        return this.firebase.firestore
          .collection("users")
          .doc(userKey)
          .collection("notifications")
          .doc(notification.id)
      })

      chaperoneNotificationsDocRefs.forEach((docRef) => {
        batch.set(docRef, notification)
      })
      batch.commit()
      console.log(
        `[notification-api] Created ${availableChaperoneUserKeys.length} notifications documents`,
      )

      // 3: Send the push notifications
      availableChaperoneNotificationTokens.forEach((token) => {
        this.pushNotificationsService.send(token, notification)
      })
      console.log(
        `[notification-api] Sent ${availableChaperoneNotificationTokens.length} push notifications`,
      )
      return {
        kind: "ok",
      }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Clears all notifications for a user
   */
  async clearAllNotifications(authContext: AuthContext): Promise<ClearAllNotificationsResult> {
    console.log("[notification-api] Clearing all notifications...")
    try {
      // 1: Get all of the user's notification documents
      const allUserNotifications = await this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("notifications")
        .get()
      const userNotificationDocRefs: firebase.firestore.DocumentReference[] = []
      allUserNotifications.forEach((doc) => {
        userNotificationDocRefs.push(doc.ref)
      })

      // 2: Schedule a batch write of a notification for every available chaperone
      const batch = this.firebase.firestore.batch()

      userNotificationDocRefs.forEach((docRef) => {
        batch.delete(docRef)
      })
      batch.commit()
      console.log(
        `[notification-api] Deleted ${userNotificationDocRefs.length} notifications documents`,
      )

      return {
        kind: "ok",
      }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Notifies a single user by creating a notification document and sending a push notification
   */
  async notifyUser(
    recipientUserKey: string,
    notification: NotificationSnapshot,
  ): Promise<NotifyUserResult> {
    console.log("[notification-api] Notifying user", recipientUserKey)
    try {
      const recipientUserDocRef = this.firebase.firestore.collection("users").doc(recipientUserKey)

      this.firebase.firestore.runTransaction((transaction) => {
        return transaction.get(recipientUserDocRef).then((userDoc) => {
          if (!userDoc.exists) {
            throw new Error("User does not exist")
          }

          const userProfile = userDoc.data() as UserProfileSnapshot

          transaction.set(
            recipientUserDocRef.collection("notifications").doc(notification.id),
            notification,
          )
          this.pushNotificationsService.send(userProfile.notificationToken, notification)
          console.log(`[notification-api] Sent a push notification to ${recipientUserKey}`)
        })
      })

      return {
        kind: "ok",
      }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
