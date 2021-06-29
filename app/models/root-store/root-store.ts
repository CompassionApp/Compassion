import { Instance, SnapshotOut, types } from "mobx-state-tree"
import * as storage from "../../utils/storage"
import { AuthStoreModel } from "../auth-store/auth-store"
import { withEnvironment } from "../extensions/with-environment"
import { NewRequestStoreModel } from "../new-request-store/new-request-store"
import { NotificationStoreModel } from "../notification-store/notification-store"
import { RequestStoreModel } from "../request-store/request-store"
import { UsersStoreModel } from "../users-store/users-store"
import { ROOT_STATE_STORAGE_KEY } from "./setup-root-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .extend(withEnvironment)
  .props({
    /** Authenticated user information */
    authStore: types.late(() => types.optional(AuthStoreModel, {} as any)),
    /** Store for all requests and request-related operations */
    requestStore: types.late(() => types.optional(RequestStoreModel, {} as any)),
    /** Represents a staging area for a new request as the user walks through the workflow */
    newRequestStore: types.late(() =>
      types.optional(NewRequestStoreModel, {
        notifications: [],
      } as any),
    ),
    /** Tracks and stores all notifications for the user */
    notificationStore: types.late(() => types.optional(NotificationStoreModel, {} as any)),
    /** Admins only: Collectiong of all user profiles */
    usersStore: types.late(() => types.optional(UsersStoreModel, {} as any)),
  })
  .actions(() => ({
    /**
     * Clears the cached data in AsyncStorage. For debugging purposes only.
     */
    clearStorage: () => {
      console.log("[root-store] Cleared storage")
      storage.remove(ROOT_STATE_STORAGE_KEY)
    },

    afterCreate() {
      console.log("[root-store] afterCreate")
      // TODO: Set up auth change hooks
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
