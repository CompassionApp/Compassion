import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { Break } from "../../components/break/break"
import { format, parse } from "date-fns"
import { CALENDAR_DATE_FORMAT, TITLE_DATE_FORMAT } from "../../constants/date-formats"
import { TxKeyPath } from "../../i18n"
import { NewRequestFooterArea } from "./common"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const ADDRESS_TEXT_OVERRIDE = {
  fontSize: 18,
}

export const NewRequestReviewScreen = observer(function NewRequestReviewScreen() {
  const { newRequestStore, requestStore } = useStores()
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("home")

  const handlePressSubmit = () => {
    // Create an empty request object
    const request = newRequestStore.convertToRequest()
    requestStore.createRequest(request)
    newRequestStore.reset()
    navigateNext()
  }

  const requestDate = newRequestStore.requestedDate
    ? format(
        parse(newRequestStore.requestedDate, CALENDAR_DATE_FORMAT, new Date()),
        TITLE_DATE_FORMAT,
      )
    : ""
  const requestTime = newRequestStore.requestedTime ? newRequestStore.requestedTime : ""

  return (
    <View testID="NewRequestReviewScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="newRequestReviewScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <Text
          preset={["header", "center"]}
          tx={`enumRequestActivity.${newRequestStore.activity}` as TxKeyPath}
        />
        <Break size={3} />
        <Text preset={["header", "center", "bold"]} text={requestDate} />
        <Text preset={["header", "center"]} text={requestTime} />
        <Break size={3} />
        <Text preset={["center", "bold"]} style={ADDRESS_TEXT_OVERRIDE}>
          {newRequestStore.meetAddress}
        </Text>
        <Text preset={["center"]}>to</Text>
        <Text preset={["center", "bold"]} style={ADDRESS_TEXT_OVERRIDE}>
          {newRequestStore.destinationAddress}
        </Text>
        <Break size={2} />
        <Text preset={["center"]}>{newRequestStore.otherComments}</Text>

        {/* <Text>{newRequestStore.id}</Text> */}
      </Screen>
      <NewRequestFooterArea step={5}>
        <Button
          tx="newRequestReviewScreen.nextButton"
          disabled={!newRequestStore.isComplete}
          onPress={handlePressSubmit}
        />
      </NewRequestFooterArea>
    </View>
  )
})
