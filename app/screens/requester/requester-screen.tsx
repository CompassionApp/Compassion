import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
// import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { useNavigation } from "@react-navigation/core"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const RequesterScreen = observer(function RequesterScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  return (
    <View testID="RequesterScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="scroll">
        <Header
          headerTx="requesterScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
          titleStyle={globalStyles.headerTitle}
        />
        <Text text="Requester" />
        <Button
          testID="back-button"
          preset="ghost"
          tx="requesterScreen.requestChaperone"
          onPress={navigateBack}
        />
      </Screen>
    </View>
  )
})
