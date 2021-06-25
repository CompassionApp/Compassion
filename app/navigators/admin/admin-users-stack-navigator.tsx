import React from "react"
import { UserDetailScreen, UsersScreen } from "../../screens"
import { createStackNavigator } from "@react-navigation/stack"

export type AdminUsersStackNavigatorParamList = {
  users: undefined
  userDetail: undefined
}

const Stack = createStackNavigator<AdminUsersStackNavigatorParamList>()

export function AdminUsersStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="users"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="users" component={UsersScreen} />
      <Stack.Screen name="userDetail" component={UserDetailScreen} />
    </Stack.Navigator>
  )
}
