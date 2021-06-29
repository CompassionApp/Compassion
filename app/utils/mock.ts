import { UserProfileModel } from "../models"
import { UserRoleEnum, UserStatusEnum } from "../types"

/**
 * Test utils
 */

/**
 * Creates a test environment that will inject a fake user
 */
export const createTestEnvironment = () => {
  const profile = UserProfileModel.create({
    id: "test-user",
    firstName: "Test",
    lastName: "User",
    email: "test@user.org",
    role: UserRoleEnum.CHAPERONE,
    status: UserStatusEnum.ACTIVE,
  })
  return {
    getStore: () => ({ authStore: { user: { profile } } }),
  }
}
