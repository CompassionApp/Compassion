import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components/native"
import { Button, Text } from "../../components"
import { color, typography } from "../../theme"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import * as datefns from "date-fns"
import { Break } from "../../components/break/break"
import { TxKeyPath } from "../../i18n"
import { TITLE_DATE_FORMAT, TIME_RANGE_FORMAT } from "../../constants/date-formats"
import { statusColorMap } from "../../constants/colors"

const BORDER_RADIUS = 5

const Container = styled.TouchableOpacity`
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

const StatusButton = styled(Button)<{ color?: string }>`
  margin-vertical: 0;
  border-radius: 0;
  padding-vertical: 9px;
  flex: 1;
  ${({ color }) => (color ? `background-color: ${color}` : "")};
`

export interface CardProps {
  requestedAt: string
  type: RequestTypeEnum
  status: RequestStatusEnum
  requestId: string
  onPress?: () => void
}

export const RequestCard = observer(function Card({
  onPress,
  requestedAt,
  type,
  status,
}: CardProps) {
  const titleDate = datefns.format(new Date(requestedAt), TITLE_DATE_FORMAT)
  const requestStartTime = new Date(requestedAt)
  // TODO: Defaulting the end time to always be +3 hrs; change this as we get a better estimate of the time range
  const requestEndTime = datefns.startOfHour(datefns.addHours(requestStartTime, 3))
  const requestStartTimeFormatted = datefns.format(requestStartTime, TIME_RANGE_FORMAT)
  const requestEndTimeFormatted = datefns.format(requestEndTime, TIME_RANGE_FORMAT)

  return (
    <Container onPress={onPress}>
      <Content>
        <Title>{titleDate}</Title>
        <Description tx={`enumRequestType.${type}` as TxKeyPath} />
        <Description>
          {requestStartTimeFormatted} - {requestEndTimeFormatted}
        </Description>
        <Break size={1} />
      </Content>
      <ButtonRow>
        <StatusButton
          tx={`enumRequestStatus.${status}` as TxKeyPath}
          color={statusColorMap.get(status)}
        />
      </ButtonRow>
    </Container>
  )
})
