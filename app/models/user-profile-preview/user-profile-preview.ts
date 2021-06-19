import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Profile preview to embed into requests and notifications. Subset of the `UserProfile` model.
 */
export const UserProfilePreviewModel = types
  .model("UserProfilePreview")
  .props({
    id: types.string,
    firstName: types.string,
    lastName: types.string,
    email: types.string,
    phoneNumber: types.maybeNull(types.string),
  })
  .views((self) => ({
    /** First name with last name initial */
    get fullName() {
      return `${self.firstName} ${self.lastName.substr(0, 1)}.`
    },
  }))

type UserProfilePreviewType = Instance<typeof UserProfilePreviewModel>
export interface UserProfilePreview extends UserProfilePreviewType {}
type UserProfilePreviewSnapshotType = SnapshotOut<typeof UserProfilePreviewModel>
export interface UserProfilePreviewSnapshot extends UserProfilePreviewSnapshotType {}
export const createUserProfilePreviewDefaultModel = () =>
  types.optional(UserProfilePreviewModel, {})
