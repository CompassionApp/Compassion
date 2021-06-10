import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthStoreModel, ExampleStoreModel, RequestStoreModel, ROOT_STATE_STORAGE_KEY } from ".."
import { CharacterStoreModel } from "../character-store/character-store"
import { NewRequestStoreModel } from "../new-request-store/new-request-store"
import * as storage from "../../utils/storage"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    characterStore: types.optional(CharacterStoreModel, {} as any),
    exampleStore: types.optional(ExampleStoreModel, {} as any),
    requestStore: types.optional(RequestStoreModel, {} as any),
    /** Represents the "staging" area for a new request as it's being built */
    newRequestStore: types.optional(NewRequestStoreModel, { request: undefined } as any),
    authStore: types.optional(AuthStoreModel, {
      user: undefined,
    }),
  })
  .actions(() => ({
    /**
     * Clears the cached data in AsyncStorage. For debugging purposes only.
     */
    clearStorage: () => {
      storage.remove(ROOT_STATE_STORAGE_KEY)
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
