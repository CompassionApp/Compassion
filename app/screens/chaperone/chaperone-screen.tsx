import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Button, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { BUTTON_STYLE, BUTTON_TEXT, color } from "../../theme"
import { useNavigation } from "@react-navigation/core"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const ChaperoneScreen = observer(function ChaperoneScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.navigate("welcome")

  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" text="" />
      <Button
        testID="next-screen-button"
        style={BUTTON_STYLE}
        textStyle={BUTTON_TEXT}
        tx="common.back"
        onPress={navigateBack}
      />
    </Screen>
  )
})
