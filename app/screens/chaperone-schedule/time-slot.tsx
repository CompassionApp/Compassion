import React from "react"
import { FlexContainer, FlexItem, Text } from "../../components"
import styled from "styled-components/native"
import { color, spacing } from "../../theme"

const Container = styled(FlexContainer)`
  width: 210px;
  margin: ${spacing[1]}px auto;
`

const Spacer = styled(FlexItem)``

const Action = styled.TouchableOpacity<{ color: string }>`
  margin-left: ${spacing[2]}px;
  padding: ${spacing[0]}px ${spacing[2]}px;
  background-color: ${({ color }) => color};
  border-radius: 9px;
`

const ActionText = styled.Text`
  color: ${color.palette.white};
  font-size: 12px;
  text-transform: uppercase;
`

interface TimeSlotProps {
  text: string
  state: "available" | "unavailable" | "scheduled"
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ state, text }) => {
  let pillColor = color.palette.grey
  let actionText = ""
  switch (state) {
    case "available":
      pillColor = color.palette.darkGreen
      actionText = "Add"
      break
    case "unavailable":
      pillColor = color.palette.grey3
      actionText = "Unavailable"
      break
    case "scheduled":
      pillColor = color.palette.darkBlue
      actionText = "Remove"
      break
  }
  return (
    <Container justifyCenter>
      <Text preset={["center"]} text={text} />
      <Spacer justifyCenter grow={1}>
        <Action color={pillColor}>
          <ActionText>{actionText}</ActionText>
        </Action>
      </Spacer>
    </Container>
  )
}
