import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import * as Permissions from "expo-permissions"

import { Button, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const CONTAINER: ViewStyle = {
  marginTop: spacing[8],
  paddingHorizontal: spacing[4],
}

export const PermissionsScreen = observer(function PermissionsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // Pull in navigation via hook
  const navigation = useNavigation()
  const [permission, askPermission] = Permissions.usePermissions([
    Permissions.LOCATION,
    Permissions.USER_FACING_NOTIFICATIONS,
  ])

  const handleCheckPermissions = () => {
    console.tron.log("Checking permissions...")
    if (permission?.status === Permissions.PermissionStatus.GRANTED) {
      console.tron.log("Permissions granted! Navigating to welcome screen")
      // If permissions are set, navigate to welcome
      navigation.navigate("welcome")
      return null
    }

    console.tron.log("Permissions haven't been granted")
  }

  const handleAskPermission = async () => {
    await askPermission()
    handleCheckPermissions()
  }

  useEffect(() => {
    handleCheckPermissions()
  }, [])

  return (
    <View style={ROOT}>
      <Screen style={CONTAINER} preset="fixed">
        <Text preset="header" tx="permissionsScreen.heading" />
        <Text tx="permissionsScreen.permissionsBody" />
        <Button text="Grant permissions" onPress={handleAskPermission} />
        <Button text="Skip to home" onPress={() => navigation.navigate("welcome")} />
      </Screen>
    </View>
  )
})
