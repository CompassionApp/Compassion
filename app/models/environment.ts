import { RootStore } from "."
import { Api } from "../services/api"
import { FirebaseCoreApiAdapter, AuthApi, RequestApi, UserApi } from "../services/firebase-api"
import { NotificationApi } from "../services/firebase-api/notification-api"
import { NotificationsService } from "../services/notifications"

let ReactotronDev
if (__DEV__) {
  const { Reactotron } = require("../services/reactotron")
  ReactotronDev = Reactotron
}

/**
 * The environment is a place where services and shared dependencies between
 * models live. They are made available to every model via dependency injection.
 */
export class Environment {
  /** Returns a RootStore instance. Set this when initializing the environment */
  getStore: () => RootStore

  constructor() {
    // create each service
    if (__DEV__) {
      // dev-only services
      this.reactotron = new ReactotronDev()
    }
    this.api = new Api()
    this.firebaseApi = new FirebaseCoreApiAdapter()
    this.notifications = new NotificationsService()

    this.authApi = new AuthApi(this.firebaseApi)
    this.notificationApi = new NotificationApi(this.firebaseApi, this.notifications)
    this.requestApi = new RequestApi(this.firebaseApi)
    this.userApi = new UserApi(this.firebaseApi)
  }

  async setup() {
    // allow each service to setup
    if (__DEV__) {
      await this.reactotron.setup()
    }
    await this.api.setup()
    await this.firebaseApi.setup()
    await this.notifications.setup()
  }

  /**
   * Reactotron is only available in dev.
   */
  reactotron: typeof ReactotronDev

  /**
   * Our api.
   */
  api: Api

  /**
   * Firebase API adapter
   */
  firebaseApi: FirebaseCoreApiAdapter

  /**
   * Notifications service
   */
  notifications: NotificationsService

  /**
   * Auth API: CRUD operations for auth
   */
  authApi: AuthApi

  /**
   * Notification API: CRUD operations for user notifications
   */
  notificationApi: NotificationApi

  /**
   * Request API: CRUD operations for requests
   */
  requestApi: RequestApi

  /**
   * User API: CRUD operations for users
   */
  userApi: UserApi
}
