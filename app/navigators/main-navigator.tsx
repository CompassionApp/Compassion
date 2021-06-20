/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { RoleSelectScreen, UserAgreementScreen } from "../screens"
import { RequesterMainTabNavigator } from "./requester/requester-root-tab-navigator"
import { ChaperoneMainTabNavigator } from "./chaperone/chaperone-root-tab-navigator"
import { EditUserProfileScreen } from "../screens/edit-user-profile/edit-user-profile-screen"
import { observer } from "mobx-react-lite"
import { useStores } from "../models"
import { UserRoleEnum } from "../types"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type MainNavigatorParamList = {
  chaperoneMain: undefined
  requesterMain: undefined
  adminMain: undefined
  editUserProfile: undefined
  roleSelect: undefined
  userAgreement: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createStackNavigator<MainNavigatorParamList>()

export const MainNavigator = observer(function MainNavigator() {
  const { authStore } = useStores()

  let initialRouteName: keyof MainNavigatorParamList
  switch (authStore?.user?.profile.role) {
    case UserRoleEnum.CHAPERONE:
      initialRouteName = "chaperoneMain"
      break
    case UserRoleEnum.REQUESTER:
      initialRouteName = "requesterMain"
      break
    case UserRoleEnum.ADMIN:
      initialRouteName = "adminMain"
      break
    default:
      initialRouteName = "roleSelect"
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="roleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="chaperoneMain" component={ChaperoneMainTabNavigator} />
      <Stack.Screen name="requesterMain" component={RequesterMainTabNavigator} />
      <Stack.Screen name="userAgreement" component={UserAgreementScreen} />
      <Stack.Screen name="editUserProfile" component={EditUserProfileScreen} />
    </Stack.Navigator>
  )
})

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["chaperoneMain", "requesterMain"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
