import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { Break } from "../../components/break/break"
import { format } from "date-fns"
import { TIME_RANGE_FORMAT, TITLE_DATE_FORMAT } from "../../constants/date-formats"
import { TxKeyPath } from "../../i18n"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const ADDRESS_TEXT_OVERRIDE = {
  fontSize: 18,
}

export const NewRequestReviewScreen = observer(function NewRequestReviewScreen() {
  const { newRequestStore, requestStore } = useStores()
  const { request } = newRequestStore
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("home")

  const handlePressSubmit = () => {
    newRequestStore.free(request)
    requestStore.createRequest(request)
    navigateNext()
  }

  let requestDate
  let requestTime
  if (request) {
    requestDate = format(new Date(request?.requestedAt), TITLE_DATE_FORMAT)
    requestTime = format(new Date(request?.requestedAt), TIME_RANGE_FORMAT)
  }

  return (
    <View testID="NewRequestReviewScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="newRequestReviewScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <Text preset={["header", "center"]} tx={`enumRequestType.${request?.type}` as TxKeyPath} />
        <Break size={3} />
        <Text preset={["header", "center", "bold"]} text={requestDate} />
        <Text preset={["header", "center"]} text={requestTime} />
        <Break size={3} />
        <Text preset={["center", "bold"]} style={ADDRESS_TEXT_OVERRIDE}>
          {request?.meetAddress}
        </Text>
        <Text preset={["center"]}>to</Text>
        <Text preset={["center", "bold"]} style={ADDRESS_TEXT_OVERRIDE}>
          {request?.destinationAddress}
        </Text>
        <Break size={2} />
        <Text>{request?.otherComments}</Text>

        <Button tx="newRequestReviewScreen.nextButton" onPress={handlePressSubmit} />

        {/* <Text>{request?.id}</Text> */}
      </Screen>
    </View>
  )
})
