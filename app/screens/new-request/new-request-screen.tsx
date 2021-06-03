import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { Header, Screen } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles } from "../../theme"
import { RequestModel, useStores } from "../../models"
import { generateUuid } from "../../utils/uuid"
import { RequestStatusEnum } from "../../types"
import { NoRequestsNotice } from "../home/no-requests-notice"
import { Break } from "../../components/break/break"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const NewRequestScreen = observer(function NewRequestScreen() {
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("newRequest", { screen: "dateSelect" })

  const { newRequestStore } = useStores()

  const handlePressNewRequest = () => {
    // Create an empty request object
    const _request = RequestModel.create({
      id: generateUuid(),
      status: RequestStatusEnum.REQUESTED,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
      // Default request date to Jan 1, 2021
      requestedAt: new Date(2021, 0, 1).toUTCString(),
      chaperones: [],
      requestStatusReason: "",
    })
    newRequestStore.save(_request)
    navigateNext()
  }

  console.log("Reading the request from newRequestStore:", newRequestStore)

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
      </Screen>
    </View>
  )
})
