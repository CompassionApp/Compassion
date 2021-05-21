import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components/native"
import { Button } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, spacing } from "../../theme"

const BORDER_RADIUS = 5

const Container = styled.View`
  background-color: ${color.palette.white};
  border-radius: ${BORDER_RADIUS}px;
  margin-vertical: 5px;
`

const NoticeContent = styled.View``
const NoticeBold = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  margin: ${spacing[2]}px 0;
`
const Notice = styled.Text`
  text-align: center;
  font-size: 18px;
  margin: ${spacing[2]}px 0;
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
        <NoticeBold>You currently don’t have anything scheduled.</NoticeBold>
        <Notice>Chaperones cannot be requested within 24H of desired day.</Notice>
      </NoticeContent>
      <Button text="Create a request" onPress={handlePressNewRequest} />
    </Container>
  )
})
