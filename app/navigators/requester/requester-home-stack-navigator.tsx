import React from "react"
import { RequesterHomeScreen, RequestDetailScreen } from "../../screens"
import { createStackNavigator } from "@react-navigation/stack"

export type RequesterHomeStackNavigatorParamList = {
  home: undefined
  requestDetail: undefined
}

const Stack = createStackNavigator<RequesterHomeStackNavigatorParamList>()

export function RequesterHomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" component={RequesterHomeScreen} />
      <Stack.Screen name="requestDetail" component={RequestDetailScreen} />
    </Stack.Navigator>
  )
}
