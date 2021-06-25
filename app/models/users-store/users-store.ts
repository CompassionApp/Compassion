import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserRoleEnum } from "../../types"
import { withAuthContext } from "../extensions/with-auth-context"
import { withEnvironment } from "../extensions/with-environment"
import { UserProfile, UserProfileModel, UserProfileSnapshot } from "../user-profile/user-profile"

/**
 * Model description here for TypeScript hints.
 */
export const UsersStoreModel = types
  .model("UsersStore")
  .props({
    /** Collection of all users in the system */
    users: types.optional(types.array(UserProfileModel), []),
    /** Selected user to view on the detail screen */
    selectedUser: types.maybe(types.safeReference(UserProfileModel)),
  })
  .extend(withEnvironment)
  .extend(withAuthContext)
  .views((self) => ({
    /** Returns a view for a `<SectionList>` by role */
    get viewAsSectionByRole() {
      const sections = {
        [UserRoleEnum.ADMIN]: [] as UserProfile[],
        [UserRoleEnum.CHAPERONE]: [] as UserProfile[],
        [UserRoleEnum.REQUESTER]: [] as UserProfile[],
      }
      self.users.forEach((userProfile) => {
        sections[userProfile.role].push(userProfile)
      })

      return sections
    },
  }))
  .actions((self) => ({
    _update: (userProfileSnapshots: UserProfileSnapshot[]) => {
      const users = []
      userProfileSnapshots.forEach((userProfileSnapshot) => {
        let userProfile
        try {
          userProfile = UserProfileModel.create(userProfileSnapshot)
        } catch (e) {
          console.log("Unable to convert. Skipping", userProfileSnapshot.id)
          return
        }
        users.push(userProfile)
      })
      self.users.replace(users)
    },
  }))
  .actions((self) => ({
    /** Fetches all user profiles */
    fetch: flow(function* () {
      const {
        kind,
        profiles,
      }: {
        kind: string
        profiles: UserProfileSnapshot[]
      } = yield self.environment.userApi.getAllUserProfiles()

      if (kind === "ok") {
        self._update(profiles)
      } else {
        __DEV__ && console.tron.log(kind)
      }
    }),

    selectUser: (user: UserProfile) => {
      console.log("[users-store] Selecting", user)
      self.selectedUser = user
    },
  }))

type UsersStoreType = Instance<typeof UsersStoreModel>
export interface UsersStore extends UsersStoreType {}
type UsersStoreSnapshotType = SnapshotOut<typeof UsersStoreModel>
export interface UsersStoreSnapshot extends UsersStoreSnapshotType {}
export const createUsersStoreDefaultModel = () => types.optional(UsersStoreModel, {})
