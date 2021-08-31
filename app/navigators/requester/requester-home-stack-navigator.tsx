import React from "react"
import { RequesterHomeScreen, RequestDetailScreen, CodeOfConductScreen } from "../../screens"
import { createStackNavigator } from "@react-navigation/stack"
import { useStores } from "../../models"

export type RequesterHomeStackNavigatorParamList = {
  home: undefined
  requestDetail: undefined
  codeOfConduct: undefined
}

const Stack = createStackNavigator<RequesterHomeStackNavigatorParamList>()

export function RequesterHomeStackNavigator() {
  const { authStore } = useStores()
  let initialRouteName: keyof RequesterHomeStackNavigatorParamList
  if (authStore?.user?.profile.isCodeOfConductSigned) {
    initialRouteName = "home"
  } else {
    initialRouteName = "codeOfConduct"
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" component={RequesterHomeScreen} />
      <Stack.Screen name="requestDetail" component={RequestDetailScreen} />
      <Stack.Screen name="codeOfConduct" component={CodeOfConductScreen} />
    </Stack.Navigator>
  )
}
