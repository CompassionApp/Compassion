import { getSnapshot } from "mobx-state-tree"
import { GeoAreaEnum, UserRoleEnum, UserStatusEnum } from "../../types"
import { UserProfileModel } from "../user-profile/user-profile"
import { UserModel } from "./user"

test("can be created", () => {
  const instance = UserModel.create({
    id: "test-user",
  })

  expect(instance).toBeTruthy()
})

test("can set a user profile", () => {
  const instance = UserModel.create({
    id: "test-user",
  })
  const profileJson = {
    id: "test-user2",
    firstName: "test",
    lastName: "test",
    email: "test",
    role: UserRoleEnum.CHAPERONE,
    status: UserStatusEnum.ACTIVE,
    geoArea: GeoAreaEnum.OAK1,
  }
  const profile = UserProfileModel.create(profileJson)
  instance.setUserProfile(getSnapshot(profile))
  const result = getSnapshot(instance.profile)
  expect(result).toBeTruthy()

  // Tests that the expected subset exists
  Object.keys(profileJson).forEach((key) => {
    expect(result[key]).toEqual(profile[key])
  })
})
