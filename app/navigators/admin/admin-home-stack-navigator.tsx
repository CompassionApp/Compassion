import React from "react"
import { AdminHomeScreen, RequestDetailScreen } from "../../screens"
import { createStackNavigator } from "@react-navigation/stack"

export type AdminHomeStackNavigatorParamList = {
  home: undefined
  requestDetail: undefined
}

const Stack = createStackNavigator<AdminHomeStackNavigatorParamList>()

export function AdminHomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" component={AdminHomeScreen} />
      <Stack.Screen name="requestDetail" component={RequestDetailScreen} />
    </Stack.Navigator>
  )
}
