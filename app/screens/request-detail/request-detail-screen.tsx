import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import styled from "styled-components/native"
import { format } from "date-fns"
import { TxKeyPath } from "../../i18n"
import { TITLE_DATE_FORMAT, TIME_RANGE_FORMAT } from "../../constants/date-formats"
import { RequestStatusEnum } from "../../types"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const Content = styled.View`
  text-align: center;
`

const GrayArea = styled.View`
  background-color: ${color.palette.grey};
  padding: ${spacing[2]}px;
  margin: ${spacing[2]}px 0;
`

const ButtonRow = styled.View`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: ${spacing[4]}px 0;
`

const LinkButton = styled(Button)`
  margin: ${spacing[2]}px auto;
`

const BUTTON_OVERRIDE = {
  marginHorizontal: spacing[1],
  minWidth: 150,
}

const LINK_BUTTON_OVERRIDE = {
  marginHorizontal: "auto",
}

export const RequestDetailScreen = observer(function RequestDetailScreen() {
  const { requestStore } = useStores()
  const { currentRequest } = requestStore

  const isRequestCanceled =
    currentRequest.status === RequestStatusEnum.CANCELED_BY_CHAPERONE ||
    currentRequest.status === RequestStatusEnum.CANCELED_BY_REQUESTER

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handlePressReschedule = () => {
    console.log("Rescheduling...")
  }
  const handlePressOk = () => {
    navigateBack()
  }
  // Toggles the canceled status
  const handlePressCancel = () => {
    requestStore.changeRequestStatus(
      currentRequest.id,
      !isRequestCanceled ? RequestStatusEnum.CANCELED_BY_REQUESTER : RequestStatusEnum.REQUESTED,
    )
  }
  const handlePressDelete = () => {
    requestStore.deleteRequest(currentRequest.id)
    navigateBack()
  }

  let requestDate
  let requestTime

  if (currentRequest) {
    requestDate = format(new Date(currentRequest.requestedAt), TITLE_DATE_FORMAT)
    requestTime = format(new Date(currentRequest.requestedAt), TIME_RANGE_FORMAT)
  }

  return (
    <View testID="RequestDetailScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="requestDetailScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />

        {!currentRequest && (
          <Content>
            <Text preset={["header", "bold", "center"]}>Request not found.</Text>
          </Content>
        )}

        {currentRequest && (
          <Content>
            <Text
              preset={["header", "center"]}
              tx={`enumRequestType.${currentRequest.type}` as TxKeyPath}
            />
            <Text preset={["header", "bold", "center"]}>{requestDate}</Text>
            <Text preset={["header", "center"]}>{requestTime}</Text>

            <GrayArea>
              <Text>ID: {currentRequest.id}</Text>
              <Text>
                Status: <Text tx={`enumRequestStatus.${currentRequest.status}` as TxKeyPath} />
              </Text>
            </GrayArea>

            <Text preset={["bold", "center"]}>{currentRequest.destinationAddress}</Text>
            <Text preset="center">to</Text>
            <Text preset={["bold", "center"]}>{currentRequest.meetAddress}</Text>
            <ButtonRow>
              <Button
                preset="ghost"
                tx="requestDetailScreen.rescheduleButton"
                style={BUTTON_OVERRIDE}
                onPress={handlePressReschedule}
              />
              <Button
                tx="requestDetailScreen.okButton"
                style={BUTTON_OVERRIDE}
                onPress={handlePressOk}
              />
            </ButtonRow>

            {!isRequestCanceled && (
              <LinkButton
                preset="link"
                tx="requestDetailScreen.cancelButton"
                style={LINK_BUTTON_OVERRIDE}
                onPress={handlePressCancel}
              />
            )}
            {isRequestCanceled && (
              <LinkButton
                preset="link"
                tx="requestDetailScreen.uncancelButton"
                style={LINK_BUTTON_OVERRIDE}
                onPress={handlePressCancel}
              />
            )}
            <LinkButton
              preset="link"
              tx="requestDetailScreen.deleteButton"
              style={LINK_BUTTON_OVERRIDE}
              onPress={handlePressDelete}
            />
          </Content>
        )}
      </Screen>
    </View>
  )
})
