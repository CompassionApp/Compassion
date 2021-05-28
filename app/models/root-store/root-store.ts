import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { ExampleStoreModel } from "../example-store/example-store"
import { NewRequestStoreModel } from "../new-request-store/new-request-store"
import { RequestStoreModel } from "../request-store/request-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  exampleStore: types.optional(ExampleStoreModel, {} as any),
  requestStore: types.optional(RequestStoreModel, {} as any),
  /** Represents the "staging" area for a new request as it's being built */
  newRequestStore: types.optional(NewRequestStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
