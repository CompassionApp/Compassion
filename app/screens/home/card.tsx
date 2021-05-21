import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components/native"
import { Button, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, typography } from "../../theme"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import * as datefns from "date-fns"

const BORDER_RADIUS = 5

const Container = styled.View`
  background-color: ${color.palette.white};
  border-radius: ${BORDER_RADIUS}px;
  margin-vertical: 5px;
  border: 1px solid ${color.palette.grey2};
`

const Content = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-vertical: 3px;
`

const Title = styled(Text)`
  font-size: 22px;
  font-family: ${typography.secondary};
  text-align: center;
  padding-vertical: 5px;
`

const Description = styled(Text)`
  text-align: center;
`

const ButtonRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`

const StatusButton = styled(Button)`
  margin-vertical: 0;
  border-radius: 0;
  padding-vertical: 9px;
  font-family: ${typography.secondary};
`

const BUTTON_STYLE_OVERRIDE = {
  flex: 1,
}

/** Maps the request type enum to a human-readable string */
const mapRequestType = new Map<RequestTypeEnum, string>([
  [RequestTypeEnum.DOCTOR, "Doctor"],
  [RequestTypeEnum.GROCERY, "Grocery"],
  [RequestTypeEnum.WALK, "Walk"],
])

/** Maps the request status enum to a human-readable string */
const mapRequestStatus = new Map<RequestStatusEnum, string>([
  [RequestStatusEnum.CANCELED_BY_REQUESTER, "Canceled"],
  [RequestStatusEnum.SCHEDULED, "Scheduled"],
  [RequestStatusEnum.REQUESTED, "Requested"],
])

export interface CardProps {
  requestedAt: string
  type: RequestTypeEnum
  status: RequestStatusEnum
  requestId: string
}

export const Card = observer(function Card({ requestedAt, type, status, requestId }: CardProps) {
  const { requestStore } = useStores()
  const navigation = useNavigation()

  const TITLE_DATE_FORMAT = "MMMM dd, yyyy"
  const TIME_RANGE_FORMAT = "h:mm a"
  const titleDate = datefns.format(new Date(requestedAt), TITLE_DATE_FORMAT)
  const requestStartTime = new Date(requestedAt)
  // TODO: Defaulting the end time to always be +3 hrs; change this as we get a better estimate of the time range
  const requestEndTime = datefns.startOfHour(datefns.addHours(requestStartTime, 3))
  const requestStartTimeFormatted = datefns.format(requestStartTime, TIME_RANGE_FORMAT)
  const requestEndTimeFormatted = datefns.format(requestEndTime, TIME_RANGE_FORMAT)

  const handlePressStatus = () => {
    navigation.navigate("requestDetail")
  }
  const handlePressReschedule = () => {
    requestStore.rescheduleRequest(requestId)
  }
  const handlePressCancel = () => {
    requestStore.cancelRequest(requestId)
  }

  return (
    <Container>
      <Content>
        <Title>{titleDate}</Title>
        <Description>{mapRequestType.get(type)}</Description>
        <Description>
          {requestStartTimeFormatted} - {requestEndTimeFormatted}
        </Description>
        <Description>{requestId}</Description>
        <Description>Status: {mapRequestStatus.get(status)}</Description>
      </Content>
      <ButtonRow>
        {status === RequestStatusEnum.REQUESTED && (
          <StatusButton
            tx="card.unmatched"
            onPress={handlePressStatus}
            style={BUTTON_STYLE_OVERRIDE}
          />
        )}
        {status === RequestStatusEnum.SCHEDULED && (
          <StatusButton tx="card.matched" style={BUTTON_STYLE_OVERRIDE} />
        )}
        {status === RequestStatusEnum.CANCELED_BY_REQUESTER && (
          <StatusButton
            tx="card.delete"
            onPress={handlePressReschedule}
            style={BUTTON_STYLE_OVERRIDE}
          />
        )}
        {status === RequestStatusEnum.REQUESTED && (
          <StatusButton
            tx="card.cancel"
            onPress={handlePressCancel}
            style={BUTTON_STYLE_OVERRIDE}
          />
        )}
      </ButtonRow>
    </Container>
  )
})
