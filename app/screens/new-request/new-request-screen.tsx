import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { Button, DebugHeaderText, Header, Screen } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles } from "../../theme"
import { NoRequestsNotice } from "../home/no-requests-notice"
import { Break } from "../../components/break/break"
import { useStores } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const NewRequestScreen = observer(function NewRequestScreen() {
  const { newRequestStore } = useStores()
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("newRequest", { screen: "dateSelect" })

  const handlePressNewRequest = () => {
    newRequestStore.reset()
    navigateNext()
  }

  const handlePressClear = () => {
    newRequestStore.reset()
  }

  return (
    <View testID="NewRequestScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="newRequestScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <Break size={5} />
        <NoRequestsNotice onPress={handlePressNewRequest} />
        <DebugHeaderText preset={["smallHeader", "center"]}>For development only</DebugHeaderText>
        <Button preset="link" text="Reset" onPress={handlePressClear} />
      </Screen>
    </View>
  )
})
