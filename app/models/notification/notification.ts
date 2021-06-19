import { Instance, SnapshotOut, types } from "mobx-state-tree"

export enum NotificationTypeEnum {
  /** A new request is sent to the chaperone */
  NEW_REQUEST = "NEW_REQUEST",
  /** Notify the requester that the request was matched */
  REQUEST_MATCHED = "REQUEST_MATCHED",
  /** Notify chaperones participants that the request was canceled by the requester */
  REQUEST_CANCELED_BY_REQUESTER = "REQUEST_CANCELED_BY_REQUESTER",
  /** Notify requester that the request was canceled by the requester */
  REQUEST_CANCELED_BY_CHAPERONE = "REQUEST_CANCELED_BY_CHAPERONE",
  /** Reminder for a request n days/hours before the requested time */
  REQUEST_REMINDER = "REQUEST_REMINDER",
  /** Notify all participants of a session that the session started */
  REQUEST_STARTED = "REQUEST_STARTED",
}

/**
 * Model for the nested data inside of a notification
 */
export const NotificationDataModel = types.model("NotificationData").props({
  /** When the notification was sent */
  sentAt: types.maybeNull(types.string),
  /** Request related to the notification */
  requestId: types.maybeNull(types.string),
  /** Date and time of the requested chaperoning session */
  requestAt: types.maybeNull(types.string),
})

/**
 * Model for a notification object. Should mirror `ExpoNotifications.NotificationContent`s fields
 */
export const NotificationModel = types.model("Notification").props({
  id: types.identifier,
  title: types.string,
  subtitle: types.maybeNull(types.string),
  // subtitle: types.optional(types.string, ""),
  body: types.string,
  type: types.enumeration<NotificationTypeEnum>(Object.values(NotificationTypeEnum)),
  data: types.maybeNull(NotificationDataModel),
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type NotificationType = Instance<typeof NotificationModel>
export interface Notification extends NotificationType {}
type NotificationSnapshotType = SnapshotOut<typeof NotificationModel>
export interface NotificationSnapshot extends NotificationSnapshotType {}
export const createNotificationDefaultModel = () => types.optional(NotificationModel, {})
