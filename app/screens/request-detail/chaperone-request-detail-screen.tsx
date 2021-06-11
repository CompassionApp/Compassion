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
import { RequestDetailProfilePhoto } from "./profile-photo"
import { ContentRow, MATCHED_TEXT_STYLE, MatchProfilePhotos } from ".."

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const Content = styled.View`
  text-align: center;
`

const ButtonRow = styled.View`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: ${spacing[4]}px 0;
`

const BUTTON_OVERRIDE = {
  marginHorizontal: spacing[1],
  minWidth: 150,
}

export const ChaperoneRequestDetailScreen = observer(function ChaperoneRequestDetailScreen() {
  const { authStore, requestStore } = useStores()
  const { currentRequest } = requestStore
  const email = authStore.user?.email

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handlePressAcceptRequest = () => {
    console.log("Accepting...")
    requestStore.acceptRequest(currentRequest.id)
    navigateBack()
  }
  const handlePressReleaseRequest = () => {
    console.log("Releasing...")
    requestStore.releaseRequest(currentRequest.id)
    navigateBack()
  }
  const handlePressOk = () => {
    navigateBack()
  }

  let requestDate
  let requestTime

  if (currentRequest) {
    requestDate = format(new Date(currentRequest.requestedAt), TITLE_DATE_FORMAT)
    requestTime = format(new Date(currentRequest.requestedAt), TIME_RANGE_FORMAT)
  }

  // Bail out of rendering if the currentRequest is falsy
  if (!currentRequest) {
    return (
      <View testID="RequestDetailScreen" style={globalStyles.full}>
        <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
          <Header
            headerTx="requestDetailScreen.title"
            leftIcon="back"
            onLeftPress={navigateBack}
            style={globalStyles.header}
          />

          <Content>
            <Text preset={["header", "bold", "center"]}>Request not found.</Text>
          </Content>
        </Screen>
      </View>
    )
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

            {currentRequest.status === RequestStatusEnum.REQUESTED && (
              <MatchProfilePhotos>
                <ContentRow>
                  <RequestDetailProfilePhoto name={currentRequest.requestedBy} />
                </ContentRow>
              </MatchProfilePhotos>
            )}

            {currentRequest.status === RequestStatusEnum.SCHEDULED && (
              <MatchProfilePhotos color={color.palette.blue}>
                <ContentRow>
                  <RequestDetailProfilePhoto
                    name={currentRequest.requestedBy}
                    style={MATCHED_TEXT_STYLE}
                  />
                </ContentRow>
              </MatchProfilePhotos>
            )}

            <Text preset={["bold", "center"]}>{currentRequest.destinationAddress}</Text>
            <Text preset="center">to</Text>
            <Text preset={["bold", "center"]}>{currentRequest.meetAddress}</Text>
            <ButtonRow>
              {currentRequest.status === RequestStatusEnum.REQUESTED && (
                <Button
                  tx="chaperoneRequestDetailScreen.acceptRequestButton"
                  style={BUTTON_OVERRIDE}
                  onPress={handlePressAcceptRequest}
                />
              )}
              {currentRequest.status === RequestStatusEnum.SCHEDULED &&
                currentRequest.containsUserAsChaperone(email) && (
                  <Button
                    preset="ghost"
                    tx="chaperoneRequestDetailScreen.releaseRequestButton"
                    style={BUTTON_OVERRIDE}
                    onPress={handlePressReleaseRequest}
                  />
                )}
              {currentRequest.status === RequestStatusEnum.SCHEDULED && (
                <Button
                  tx="requestDetailScreen.okButton"
                  style={BUTTON_OVERRIDE}
                  onPress={handlePressOk}
                />
              )}
            </ButtonRow>
            <Text>ID: {currentRequest.id}</Text>
            <Text>
              Status: <Text tx={`enumRequestStatus.${currentRequest.status}` as TxKeyPath} />
            </Text>
          </Content>
        )}
      </Screen>
    </View>
  )
})
