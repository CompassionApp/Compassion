import { Platform } from "react-native"
import * as ExpoNotifications from "expo-notifications"
import Constants from "expo-constants"
import { NotificationSnapshot } from "../../models"

/**
 * Notifications service
 */
export class NotificationsService {
  rootStore: any
  notifications: typeof ExpoNotifications
  private _token: string

  get deviceNotificationToken() {
    return this._token
  }

  /**
   * Create the Notification service
   */
  constructor() {
    this.notifications = ExpoNotifications
  }

  /**
   * Check for push notification permissions on the device and request if it hasn't been granted
   */
  async checkPermissions() {
    const { status: existingStatus } = await this.notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await this.notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      console.error("Failed to get push token for push notifications!")
    }
  }

  async registerForNotifications() {
    let token
    if (Constants.isDevice) {
      this.checkPermissions()
      token = (await this.notifications.getExpoPushTokenAsync()).data
    } else {
      console.log(
        "[WARNING] Could not set up push notification service. Must use a physical device.",
      )
    }

    if (Platform.OS === "android") {
      this.notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: ExpoNotifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    return token
  }

  /**
   * Setup
   */
  async setup() {
    this.notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    })

    this._token = await this.registerForNotifications()

    // Bail out of setup if a device token hasn't been established
    if (!this._token) {
      return
    }

    console.log("Subscribed to push notifications with token", this.deviceNotificationToken)

    // console.log("Registering notification handlers")
    // this.notifications.addNotificationReceivedListener((notification) => {
    //   console.log("Received notification!", notification)
    // })

    // this.notifications.addNotificationResponseReceivedListener((response) => {
    //   console.log("Received notification response!", response)
    // })
  }

  /**
   * Sends a push notification to a device running Expo
   */
  async send(
    recipientToken: string,
    notificationPayload: NotificationSnapshot | Partial<ExpoNotifications.NotificationContent>,
  ) {
    const message = {
      to: recipientToken,
      sound: "default",
      ...notificationPayload,
    }
    console.log("[notifications-service] Sending notification", JSON.stringify(message))

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
  }
}
