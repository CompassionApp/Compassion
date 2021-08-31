import React from "react"
import {
  ChaperoneHomeScreen,
  ChaperoneRequestDetailScreen,
  CodeOfConductScreen,
} from "../../screens"
import { createStackNavigator } from "@react-navigation/stack"
import { useStores } from "../../models"

export type ChaperoneHomeStackNavigatorParamList = {
  home: undefined
  requestDetail: undefined
  codeOfConduct: undefined
}

const Stack = createStackNavigator<ChaperoneHomeStackNavigatorParamList>()

export function ChaperoneHomeStackNavigator() {
  const { authStore } = useStores()
  let initialRouteName: keyof ChaperoneHomeStackNavigatorParamList
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
      <Stack.Screen name="home" component={ChaperoneHomeScreen} />
      <Stack.Screen name="requestDetail" component={ChaperoneRequestDetailScreen} />
      <Stack.Screen name="codeOfConduct" component={CodeOfConductScreen} />
    </Stack.Navigator>
  )
}
