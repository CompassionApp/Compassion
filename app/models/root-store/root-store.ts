import { Instance, SnapshotOut, types } from "mobx-state-tree"
import {
  AuthStoreModel,
  NotificationStoreModel,
  RequestStoreModel,
  ROOT_STATE_STORAGE_KEY,
  NewRequestStoreModel,
} from ".."
import * as storage from "../../utils/storage"
import { withEnvironment } from "../extensions/with-environment"

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
    newRequestStore: types.late(() => types.optional(NewRequestStoreModel, {} as any)),
    /** Tracks and stores all notifications for the user */
    notificationStore: types.late(() => types.optional(NotificationStoreModel, {} as any)),
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
