import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components/native"
import { FlexContainer, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
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
  margin-vertical: ${spacing[2]}px;
  border: 1px solid ${color.palette.grey2};
`

const Content = styled(FlexContainer)`
  padding-vertical: ${spacing[1]}px;
`

const Title = styled(Text)`
  font-size: 22px;
  font-family: ${typography.secondary};
  text-align: center;
  padding-vertical: ${spacing[2]}px;
`

const Description = styled(Text)`
  text-align: center;
`

const StatusArea = styled(FlexContainer)<{ color?: string }>`
  ${({ color }) => (color ? `background-color: ${color}` : "")};
`

const StatusTextField = styled(Text)`
  padding-vertical: ${spacing[2]}px;
  color: ${color.palette.white};
  text-transform: uppercase;
  font-size: 15px;
  font-family: ${typography.secondary};
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
      <Content column justifyCenter>
        <Title>{titleDate}</Title>
        <Description tx={`enumRequestType.${type}` as TxKeyPath} />
        <Description>
          {requestStartTimeFormatted} - {requestEndTimeFormatted}
        </Description>
        <Break size={1} />
      </Content>
      <StatusArea justifyCenter width="100%" color={statusColorMap.get(status)}>
        <StatusTextField tx={`enumRequestStatus.${status}` as TxKeyPath} />
      </StatusArea>
    </Container>
  )
})
