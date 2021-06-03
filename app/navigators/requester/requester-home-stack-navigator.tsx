import React from "react"
import { HomeScreen, RequestDetailScreen } from "../../screens"
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
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="requestDetail" component={RequestDetailScreen} />
    </Stack.Navigator>
  )
}
