import React from "react"
import { observer } from "mobx-react-lite"
import { Alert, View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"
import { format } from "date-fns"
import {
  Break,
  Button,
  FlexContainer,
  Header,
  Screen,
  Text,
  DebugHeaderText,
} from "../../components"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { TxKeyPath } from "../../i18n"
import { TITLE_DATE_FORMAT, TIME_RANGE_FORMAT } from "../../constants/date-formats"
import { RequestStatusEnum } from "../../types"
import { RequestDetailProfilePhoto } from "./profile-photo"
import {
  MatchProfilePhotos,
  UNMATCHED_TEXT_STYLE,
  MATCHED_TEXT_STYLE,
  OtherCommentsArea,
  ButtonRow,
  LinkButton,
  DebugText,
} from "./common"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const Content = styled.View`
  text-align: center;
`

const BUTTON_OVERRIDE = {
  marginHorizontal: spacing[1],
  minWidth: 150,
}

export const RequestDetailScreen = observer(function RequestDetailScreen() {
  const { requestStore, newRequestStore } = useStores()
  const { currentRequest } = requestStore

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handlePressReschedule = () => {
    function reschedule() {
      requestStore.rescheduleRequest(currentRequest)
      newRequestStore.replaceFromRequest(currentRequest)
      navigation.navigate("home")
      navigation.navigate("newRequest", { params: { screen: "dateSelect" } })
    }
    if (!newRequestStore.isClean) {
      Alert.alert(
        "Request in Progress",
        `You were already creating a request. Do you want to start over and reschedule instead?`,
        [
          {
            text: "Yes",
            onPress: () => {
              reschedule()
            },
          },
          {
            text: "No",
            style: "cancel",
          },
        ],
      )
    } else {
      reschedule()
    }
  }

  const handlePressOk = () => {
    navigateBack()
  }

  // Toggles the canceled status
  const handlePressCancel = () => {
    if (!currentRequest.isCanceled) {
      requestStore.cancelRequestAsRequester(currentRequest)
    } else {
      requestStore.changeRequestStatus(currentRequest.id, RequestStatusEnum.REQUESTED)
    }
  }

  const handlePressDelete = () => {
    Alert.alert(
      "Delete Request",
      "Are you sure you want to delete this request? This cannot be undone.",
      [
        {
          text: "Yes",
          onPress: () => {
            requestStore.deleteRequest(currentRequest.id)
            navigateBack()
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
    )
  }

  let requestDate
  let requestTime

  if (currentRequest) {
    requestDate = format(new Date(currentRequest.requestedAt), TITLE_DATE_FORMAT)
    requestTime = format(new Date(currentRequest.requestedAt), TIME_RANGE_FORMAT)
  }

  return (
    <View testID="RequestDetailScreen" style={globalStyles.full}>
      <Screen style={ROOT} preset="fixed">
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
              tx={`enumRequestActivity.${currentRequest.activity}` as TxKeyPath}
            />
            <Text preset={["header", "bold", "center"]}>{requestDate}</Text>
            <Text preset={["header", "center"]}>{requestTime}</Text>
            <Break />

            {currentRequest.status === RequestStatusEnum.REQUESTED && (
              <MatchProfilePhotos>
                <Text
                  preset={["center"]}
                  tx="requestDetailScreen.requestPending"
                  style={UNMATCHED_TEXT_STYLE}
                />
                <Break />
                <FlexContainer justifyCenter>
                  <RequestDetailProfilePhoto />
                  <RequestDetailProfilePhoto />
                </FlexContainer>
                <Break />
                <Text
                  preset={["bold", "center"]}
                  tx="requestDetailScreen.requestPending2"
                  style={UNMATCHED_TEXT_STYLE}
                />
              </MatchProfilePhotos>
            )}

            {currentRequest.status === RequestStatusEnum.SCHEDULED && (
              <MatchProfilePhotos color={color.palette.blue}>
                <Text
                  preset={["center"]}
                  tx="requestDetailScreen.youAreMatched"
                  style={MATCHED_TEXT_STYLE}
                />
                <Break />
                <FlexContainer justifyCenter>
                  {currentRequest.chaperones.map((chaperone) => (
                    <RequestDetailProfilePhoto
                      key={chaperone.id}
                      previewProfile={chaperone}
                      style={MATCHED_TEXT_STYLE}
                    />
                  ))}
                </FlexContainer>
              </MatchProfilePhotos>
            )}

            <Text preset={["bold", "center"]}>{currentRequest.destinationAddress}</Text>
            <Text preset="center">to</Text>
            <Text preset={["bold", "center"]}>{currentRequest.meetAddress}</Text>
            {/* {currentRequest.isScheduled && (
              <ButtonRow justifyCenter>
                {currentRequest.chaperones.map((chaperone) => (
                  <CallButton
                    key={chaperone.id}
                    name={chaperone.fullName}
                    number={chaperone.phoneNumber}
                  />
                ))}
              </ButtonRow>
            )} */}
            <OtherCommentsArea column>
              <Text preset={["center"]}>
                {currentRequest.otherComments ? currentRequest.otherComments : "None"}
              </Text>
            </OtherCommentsArea>
            <ButtonRow justifyCenter>
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

            {!currentRequest.isCanceled && (
              <LinkButton
                preset="link"
                tx="requestDetailScreen.cancelButton"
                onPress={handlePressCancel}
              />
            )}
            <DebugHeaderText preset={["smallHeader", "center"]}>
              For development only
            </DebugHeaderText>

            {currentRequest.isCanceled && (
              <LinkButton
                preset="link"
                tx="requestDetailScreen.uncancelButton"
                faded
                onPress={handlePressCancel}
              />
            )}
            <LinkButton
              preset="link"
              tx="requestDetailScreen.deleteButton"
              faded
              onPress={handlePressDelete}
            />
            <DebugText preset="code">ID: {currentRequest.id}</DebugText>
            <DebugText preset="code">
              Status: <DebugText tx={`enumRequestStatus.${currentRequest.status}` as TxKeyPath} />
            </DebugText>
          </Content>
        )}
      </Screen>
    </View>
  )
})
