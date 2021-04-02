import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../../components"
// import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { useNavigation } from "@react-navigation/core"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const ChaperoneScreen = observer(function ChaperoneScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  return (
    <View testID="ChaperoneScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="scroll">
        <Text preset="header" text="Chaperone" />
        <Button
          testID="back-button"
          style={globalStyles.buttonSecondary}
          textStyle={globalStyles.buttonSecondaryText}
          tx="common.back"
          onPress={navigateBack}
        />
      </Screen>
    </View>
  )
})
