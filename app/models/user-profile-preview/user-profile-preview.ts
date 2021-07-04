import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * A user profile preview is a subset of a full `UserProfile` model with the express purpose of embedding
 * the previews into requests and notifications.
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
