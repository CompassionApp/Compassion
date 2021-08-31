import { applySnapshot, flow, getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GeoAreaEnum, UserRoleEnum, UserStatusEnum } from "../../types"
import { withEnvironment } from "../extensions/with-environment"
import { UserProfilePreviewModel } from "../user-profile-preview/user-profile-preview"

/**
 * A `UserProfile` contains the extraneous attributes for a user that we care about in this app
 */
export const UserProfileModel = types
  .model("UserProfile")
  .props({
    id: types.identifier,
    createdAt: types.optional(types.string, new Date().toUTCString()),
    updatedAt: types.optional(types.string, new Date().toUTCString()),
    lastLoginAt: types.maybeNull(types.string),
    role: types.enumeration<UserRoleEnum>(Object.values(UserRoleEnum)),
    firstName: types.string,
    lastName: types.string,
    email: types.string,
    phoneNumber: types.maybeNull(types.string),
    status: types.enumeration<UserStatusEnum>(Object.values(UserStatusEnum)),
    geoArea: types.optional(
      types.enumeration<GeoAreaEnum>(Object.values(GeoAreaEnum)),
      GeoAreaEnum.OAK1,
    ),
    latestCovidTestVerifiedAt: types.maybeNull(types.string),
    signedCodeOfConductAt: types.maybeNull(types.string),
    acceptedUserAgreementAt: types.maybeNull(types.string),
    notificationToken: types.maybeNull(types.string),
    enableNotifications: types.maybeNull(types.boolean),
    isCodeOfConductSigned: types.maybeNull(types.boolean),
  })
  .extend(withEnvironment)
  .views((self) => ({
    /** Returns a "preview profile", which is an abbreviated UserProfile for use to embed in
     * requests and notifications */
    get preview() {
      const profilePreview = UserProfilePreviewModel.create({
        id: self.id,
        firstName: self.firstName,
        lastName: self.lastName,
        email: self.email,
        phoneNumber: self.phoneNumber,
      })
      return profilePreview
    },

    get isChaperone() {
      return self.role === UserRoleEnum.CHAPERONE
    },
    get isAdmin() {
      return self.role === UserRoleEnum.ADMIN
    },
    get isRequester() {
      return self.role === UserRoleEnum.REQUESTER
    },
  }))
  .actions((self) => ({
    updateLocal: (profile: UserProfileSnapshot) => {
      applySnapshot(self, profile)
    },
  }))
  .actions((self) => ({
    acceptUserAgreement: () => {
      self.acceptedUserAgreementAt = new Date().toUTCString()
    },
    signCodeOfConduct: () => {
      self.signedCodeOfConductAt = new Date().toUTCString()
    },
    setPhoneNumber: (value: string) => {
      self.phoneNumber = value
    },
    setFirstName: (value: string) => {
      self.firstName = value
    },
    setLastName: (value: string) => {
      self.lastName = value
    },
    setStatus: (value: UserStatusEnum) => {
      self.status = value
    },
    setNotificationToken: (value: string | null) => {
      self.notificationToken = value
    },
    setEnableNotifications: (value: boolean | null) => {
      self.enableNotifications = value
    },
    setCodeOfConductSignedStatus: (value: boolean | null) => {
      self.isCodeOfConductSigned = value
    },

    fetch: flow(function* () {
      console.log("[user-profile] Fetching user profile...")

      const {
        kind,
        profile,
      }: {
        kind: string
        profile: UserProfileSnapshot
      } = yield self.environment.userApi.getUserProfile(self.email)
      if (kind === "ok") {
        self.updateLocal(profile)
      } else {
        throw new Error(kind)
      }
    }),

    /**
     * Saves the user profile document on Firestore with the data from the local store
     */
    save: flow(function* () {
      console.log("[user-profile] Updating user profile...")
      self.updatedAt = new Date().toUTCString()
      yield self.environment.userApi.saveUserProfile(self.email, getSnapshot(self))
    }),
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type UserProfileType = Instance<typeof UserProfileModel>
export interface UserProfile extends UserProfileType {}
type UserProfileSnapshotType = SnapshotOut<typeof UserProfileModel>
export interface UserProfileSnapshot extends UserProfileSnapshotType {}
export const createUserProfileDefaultModel = () => types.optional(UserProfileModel, {})
