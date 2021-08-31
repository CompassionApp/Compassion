import React from "react"
import { AdminHomeScreen, RequestDetailScreen, CodeOfConductScreen } from "../../screens"
import { createStackNavigator } from "@react-navigation/stack"
import { useStores } from "../../models"

export type AdminHomeStackNavigatorParamList = {
  home: undefined
  requestDetail: undefined
  codeOfConduct: undefined
}

const Stack = createStackNavigator<AdminHomeStackNavigatorParamList>()

export function AdminHomeStackNavigator() {
  const { authStore } = useStores()
  let initialRouteName: keyof AdminHomeStackNavigatorParamList
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
      <Stack.Screen name="home" component={AdminHomeScreen} />
      <Stack.Screen name="requestDetail" component={RequestDetailScreen} />
      <Stack.Screen name="codeOfConduct" component={CodeOfConductScreen} />
    </Stack.Navigator>
  )
}
