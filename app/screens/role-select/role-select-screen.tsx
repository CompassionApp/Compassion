import React from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
// import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { useNavigation } from "@react-navigation/native"

const ROOT: ViewStyle = {
  flex: 1,
}

const HUGE_BUTTON: ViewStyle = {
  height: 200,
}

const BUTTON_TITLE: TextStyle = {
  fontSize: 30,
  color: color.palette.white,
}
const BUTTON_DESCRIPTION: TextStyle = {
  fontSize: 16,
  color: color.palette.white,
}
export const RoleSelectScreen = observer(function RoleSelectScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateChaperone = () => navigation.navigate("chaperone")
  const navigateRequester = () => navigation.navigate("requester")

  return (
    <View testID="RoleSelectScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="roleSelectScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        {/* <Text preset="header" text="Role Select" /> */}
        <Button testID="back-button" style={{ ...HUGE_BUTTON }} onPress={navigateRequester}>
          <Text style={BUTTON_TITLE} tx="roleSelectScreen.requester"></Text>
          <Text style={BUTTON_DESCRIPTION} tx="roleSelectScreen.requesterDescription"></Text>
        </Button>
        <Button testID="back-button" style={{ ...HUGE_BUTTON }} onPress={navigateChaperone}>
          <Text style={BUTTON_TITLE} tx="roleSelectScreen.chaperone"></Text>
          <Text style={BUTTON_DESCRIPTION} tx="roleSelectScreen.chaperoneDescription"></Text>
        </Button>
      </Screen>
    </View>
  )
})
