import React from "react"
import { Linking } from "react-native"
import { observer } from "mobx-react-lite"
import styled from "styled-components/native"
import { Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color } from "../../theme"
import { Break } from "../../components/break/break"
import { IconButton } from "../../components/icon-button/icon-button"
import { TouchableOpacity } from "react-native-gesture-handler"

const BORDER_RADIUS = 5

const Container = styled.View`
  background-color: ${color.background};
  border-radius: ${BORDER_RADIUS}px;
  margin-vertical: 5px;
`

const NoticeContent = styled.View``

const CIO_PHONE_NUMBER = "5102008682"

export interface NoRequestsNoticeProps {
  onPress?: () => void
}

export const NoRequestsNotice = observer(function NoRequestsNotice({
  onPress,
}: NoRequestsNoticeProps) {
  const navigation = useNavigation()

  const handlePressNewRequest = () => {
    navigation.navigate("newRequest")
  }

  const handlePressPhoneNumber = () => {
    Linking.openURL(`tel://${CIO_PHONE_NUMBER}`)
  }

  return (
    <Container>
      <NoticeContent>
        <Text preset={["center"]} tx="homeScreen.noticeText1" />
        <Break />
        <Text preset={["center"]} tx="homeScreen.noticeText2" />
        <Break />
        <Text preset={["center"]} tx="homeScreen.noticeText3" />
        <TouchableOpacity onPress={handlePressPhoneNumber}>
          <Text preset={["center", "header", "bold"]} tx="homeScreen.noticeTextPhoneNumber" />
        </TouchableOpacity>
        <Text preset={["center"]} tx="homeScreen.noticeText4" />
        <Break size={4} />
      </NoticeContent>
      <IconButton
        icon="requestWhite"
        tx="homeScreen.requestButton"
        onPress={onPress || handlePressNewRequest}
      />
    </Container>
  )
})
