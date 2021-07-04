import React from "react"
import { MaterialIcons } from "@expo/vector-icons"

import { Linking } from "react-native"
import styled from "styled-components/native"
import { Button, FlexContainer, Text } from "../../components"
import { color, spacing, typography } from "../../theme"

const StyledButton = styled(Button)`
  width: ${150 * 2 + spacing[1] * 2}px;
  margin-top: ${spacing[4]}px;
`
const CallButtonText = styled(Text)`
  color: ${color.palette.white};
  font-family: ${typography.secondary};
  text-transform: uppercase;
`

export interface CallButtonProps {
  number: string
  name: string
}

export const CallButton: React.FC<CallButtonProps> = ({ number, name }) => {
  const handlePressCall = () => {
    Linking.openURL(`tel://${number}`)
  }

  return (
    <StyledButton onPress={handlePressCall}>
      <FlexContainer>
        <MaterialIcons name="phone" color={color.palette.white} size={20} />
        <CallButtonText> CALL {name}</CallButtonText>
      </FlexContainer>
    </StyledButton>
  )
}
