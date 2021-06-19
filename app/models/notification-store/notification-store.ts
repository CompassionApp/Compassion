import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withAuthContext } from "../extensions/with-auth-context"
import { withEnvironment } from "../extensions/with-environment"
import { NotificationModel, NotificationSnapshot } from "../notification/notification"

/**
 * Notification inbox for the current user
 */
export const NotificationStoreModel = types
  .model("NotificationStore")
  .props({
    /** Notifications for the current user */
    inbox: types.optional(types.array(NotificationModel), []),
    /** Notification selected for viewing */
    selectedNotification: types.maybe(types.safeReference(NotificationModel)),
  })
  .extend(withEnvironment)
  .extend(withAuthContext)
  .views((self) => ({
    /** Returns the latest notification */
    get latestNotification() {
      if (self.inbox.length === 0) {
        return undefined
      }
      return self.inbox[self.inbox.length - 1]
    },

    /** Returns notifications sorted by sent date */
    get notifications() {
      return self.inbox.slice().sort(sortBySentAt)
    },

    /** Total count of notifications */
    get notificationCount() {
      return self.inbox.length
    },
  }))
  /** Local store actions */
  .actions((self) => ({
    _updateNotifications: (notifications: NotificationSnapshot[]) => {
      self.inbox.replace(notifications)
    },
    _clearNotifications: () => {
      self.inbox.clear()
    },
    _removeNotification: (notification: NotificationSnapshot) => {
      self.inbox.remove(notification)
    },
  }))
  /** External model actions */
  .actions((self) => ({
    /** Fetch all user notificationss */
    fetch: flow(function* () {
      console.log("[notification-store] Fetching")
      const {
        kind,
        notifications,
      }: {
        kind: string
        notifications: NotificationSnapshot[]
      } = yield self.environment.notificationApi.getNotificationsForUser(self.authContext)

      if (kind === "ok") {
        self._updateNotifications(notifications)
      } else {
        __DEV__ && console.tron.log(kind)
      }
    }),

    /** Select a notification for viewing */
    selectNotification: (id: string) => {
      console.log("[notification-store] Selecting", id)
      const result = self.inbox.find((notification) => notification.id === id)
      self.selectedNotification = result
    },

    /** Dismiss a notification */
    dismissNotification: (id: string) => {
      console.log("[notification-store] Dismissing", id)
      // self._removeNotification()
    },

    /** Dismiss all notifications */
    clearAll: flow(function* () {
      console.log("[notification-store] Dismissing all")
      const {
        kind,
      }: {
        kind: string
      } = yield self.environment.notificationApi.clearAllNotifications(self.authContext)

      if (kind === "ok") {
        self._clearNotifications()
      } else {
        __DEV__ && console.tron.log(kind)
      }
    }),

    sendNotification: (recipient: string, notification: NotificationSnapshot) => {
      self.environment.notifications.send(recipient, notification)
    },

    /**
     * Notifies all chaperones about a new request
     */
    notifyChaperonesNewRequest: flow(function* (notification: NotificationSnapshot) {
      console.log("[notification-store] Broadcasting request")
      const {
        kind,
      }: {
        kind: string
      } = yield self.environment.notificationApi.notifyAllChaperones(notification)

      if (kind === "ok") {
        console.log("success")
      } else {
        console.log(kind)
        __DEV__ && console.tron.log(kind)
      }
    }),
  }))

  /**
   * Subscriptions
   */
  .actions((self) => {
    /** Collection of unsubscribe handlers from our onSnapshot listeners */
    const unsubscribeHandlers: (() => void)[] = []

    return {
      /**
       * Unsubscribes from all previously registered subscriptions
       */
      unsubscribeAll: () => {
        console.log(
          `[notification-store] Unsubscribing to ${unsubscribeHandlers.length} subscriptions`,
        )

        while (unsubscribeHandlers.length > 0) {
          const unsubscribe = unsubscribeHandlers.pop()
          unsubscribe()
        }
      },

      /** Subscribes to notifications for a user */
      subscribe: () => {
        console.log("[notification-store] Subscribing")
        const unsubscribe = self.environment.notificationApi.subscribeToUserNotifications(
          self.authContext,
          (notifications) => {
            console.log(
              "[notification-store] User's notifications from subscription:",
              notifications.map((notification) => notification.id),
            )
            self._updateNotifications(notifications)
          },
        )
        unsubscribeHandlers.push(unsubscribe)
      },
    }
  })

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type NotificationStoreType = Instance<typeof NotificationStoreModel>
export interface NotificationStore extends NotificationStoreType {}
type NotificationStoreSnapshotType = SnapshotOut<typeof NotificationStoreModel>
export interface NotificationStoreSnapshot extends NotificationStoreSnapshotType {}
export const createNotificationStoreDefaultModel = () => types.optional(NotificationStoreModel, {})

const sortBySentAt = (a: NotificationSnapshot, b: NotificationSnapshot) => {
  const aTime = new Date(a.data.sentAt).getTime()
  const bTime = new Date(b.data.sentAt).getTime()
  if (aTime < bTime) {
    return 1
  }
  if (aTime > bTime) {
    return -1
  }
  return 0
}
