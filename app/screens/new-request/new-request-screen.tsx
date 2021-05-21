import React from "react"
import { observer } from "mobx-react-lite"
import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid"
import { ViewStyle, View, TextStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { Footer } from "../../components/footer/footer"
import { Request, RequestStatusEnum, RequestTypeEnum } from "../../types/request"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
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

export const NewRequestScreen = observer(function NewRequestScreen() {
  // Pull in one of our MST stores
  const { requestStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handleCreateRequest = () => {
    // TODO: Can use ajv to validate and set defaults
    const request: Request = {
      id: uuidv4(),
      createdAt: new Date().toUTCString(),
      requestedAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
      meetAddress: "1234 Main, Oakland, CA",
      destinationAddress: "5 Old Town Road, Oakland, CA",
      status: RequestStatusEnum.REQUESTED,
      type: RequestTypeEnum.GROCERY,
      chaperones: [],
      rescheduledRequestId: "",
      requestStatusReason: "",
      otherComments: "",
    }
    requestStore.createRequest(request)
    navigation.navigate("home")
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

        <Button testID="back-button" style={{ ...HUGE_BUTTON }} onPress={handleCreateRequest}>
          <Text style={BUTTON_TITLE} text="Create Request"></Text>
          <Text style={BUTTON_DESCRIPTION} tx="roleSelectScreen.requesterDescription"></Text>
        </Button>
      </Screen>
      <Footer />
    </View>
  )
})
