import { MainNavigatorParamList } from "../navigators"
import { UserRoleEnum } from "../types"

/**
 * Maps role types to their respective home screens
 */
export const roleTypeToScreenMap = new Map<UserRoleEnum, keyof MainNavigatorParamList>([
  [UserRoleEnum.REQUESTER, "requesterMain"],
  [UserRoleEnum.CHAPERONE, "chaperoneMain"],
  // TODO: Update when we have an admin home page
  [UserRoleEnum.ADMIN, "roleSelect"],
])
