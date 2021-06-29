const { sendPushNotifications, notificationServiceUrl } = require("../../config/env")

/**
 * The options used to configure the API.
 */
export interface PushNotificationsConfig {
  sendPushNotifications: boolean
  notificationServiceUrl: string
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_PUSH_NOTIFICATIONS_CONFIG: PushNotificationsConfig = {
  sendPushNotifications,
  notificationServiceUrl,
}
