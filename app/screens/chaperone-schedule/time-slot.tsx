import React from "react"
import { Text } from "../../components"
import styled from "styled-components/native"
import { color, spacing } from "../../theme"

const Container = styled.View`
  width: 210px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: ${spacing[1]}px auto;
`

const Spacer = styled.View`
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`

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
    <Container>
      <Text preset={["center"]} text={text} />
      <Spacer>
        <Action color={pillColor}>
          <ActionText>{actionText}</ActionText>
        </Action>
      </Spacer>
    </Container>
  )
}
