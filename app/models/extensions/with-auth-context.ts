import { getEnv, IStateTreeNode } from "mobx-state-tree"
import { Environment } from "../environment"
import { User } from "../user/user"

/**
 * Adds an auth context property to the node for accessing the currently logged in user's details
 */
export const withAuthContext = (self: IStateTreeNode) => ({
  views: {
    /**
     * Returns the context of the currently authenticated user
     */
    get authContext(): User | undefined {
      const store = getEnv<Environment>(self).getStore()
      return store.authStore.user
    },
  },
})
