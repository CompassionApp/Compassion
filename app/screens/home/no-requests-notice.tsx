import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components/native"
import { Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color } from "../../theme"
import { Break } from "../../components/break/break"
import { IconButton } from "../../components/icon-button/icon-button"

const BORDER_RADIUS = 5

const Container = styled.View`
  background-color: ${color.background};
  border-radius: ${BORDER_RADIUS}px;
  margin-vertical: 5px;
`

const NoticeContent = styled.View``
const NoticeBold = styled(Text)`
  text-align: center;
`
const Notice = styled(Text)`
  text-align: center;
`

export interface NoRequestsNoticeProps {}

export const NoRequestsNotice = observer(function NoRequestsNotice() {
  const navigation = useNavigation()

  const handlePressNewRequest = () => {
    navigation.navigate("newRequest")
  }

  return (
    <Container>
      <NoticeContent>
        <NoticeBold preset="bold" tx="homeScreen.noneScheduledNoticeBold" />
        <Notice tx="homeScreen.noticeText1" />
        <Break />
        <Notice tx="homeScreen.noticeText2" />
        <Break />
        <Notice tx="homeScreen.noticeText3" />
        <Notice preset={["header", "bold"]} tx="homeScreen.noticeTextPhoneNumber" />
        <Notice tx="homeScreen.noticeText4" />
        <Break size={4} />
      </NoticeContent>
      <IconButton
        icon="requestWhite"
        tx="homeScreen.requestButton"
        onPress={handlePressNewRequest}
      />
    </Container>
  )
})
