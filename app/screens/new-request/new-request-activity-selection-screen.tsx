import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"
import { Button, Header, Screen, TextField } from "../../components"
import { color, globalStyles } from "../../theme"
import { RequestTypeEnum } from "../../types"
import { translate, TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { NewRequestFooterArea } from "./common"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const ADDITIONAL_NOTES_INPUT_STYLE = {
  minHeight: 150,
}

export const NewRequestActivitySelectionScreen = observer(
  function NewRequestActivitySelectionScreen() {
    const { newRequestStore } = useStores()

    const [selectedActivity, setSelectedActivity] = useState<RequestTypeEnum>(
      (newRequestStore.type as RequestTypeEnum) || RequestTypeEnum.GROCERY,
    )
    const [requestNotes, setRequestNotes] = useState<string>(newRequestStore.otherComments ?? "")

    const navigation = useNavigation()
    const navigateBack = () => navigation.goBack()
    const navigateNext = () => navigation.navigate("newRequest", { screen: "review" })

    const handlePressNext = () => {
      newRequestStore.setType(selectedActivity)
      newRequestStore.setOtherComments(requestNotes)
      navigateNext()
    }
    // Request types to _not_ show
    const filterRequestTypes: RequestTypeEnum[] = [RequestTypeEnum.UNKNOWN]

    return (
      <View testID="NewRequestActivitySelectionScreen" style={globalStyles.full}>
        <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
          <Header
            headerTx="newRequestActivitySelectionScreen.title"
            leftIcon="back"
            onLeftPress={navigateBack}
            style={globalStyles.header}
          />

          <Picker
            selectedValue={selectedActivity}
            onValueChange={(itemValue) => setSelectedActivity(itemValue)}
          >
            {Object.keys(RequestTypeEnum)
              .filter((requestType) => !filterRequestTypes.includes(requestType as RequestTypeEnum))
              .map((requestType) => (
                <Picker.Item
                  key={requestType}
                  label={translate(`enumRequestType.${requestType}` as TxKeyPath)}
                  value={requestType}
                />
              ))}
          </Picker>

          <TextField
            multiline
            defaultValue={requestNotes}
            placeholderTx="newRequestActivitySelectionScreen.additionalNotesPlaceholder"
            labelTx="newRequestActivitySelectionScreen.additionalNotesLabel"
            inputStyle={ADDITIONAL_NOTES_INPUT_STYLE}
            onChangeText={(text) => setRequestNotes(text)}
          />
        </Screen>
        <NewRequestFooterArea step={4}>
          <Button tx="newRequestActivitySelectionScreen.nextButton" onPress={handlePressNext} />
        </NewRequestFooterArea>
      </View>
    )
  },
)
