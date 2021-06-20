import React from "react"
import styled from "styled-components/native"
import ProgressIndicator from "../../components/progress-indicator/progress-indicator"
import { color, spacing } from "../../theme"

export const NEW_REQUEST_TOTAL_STEPS = 5

const NewRequestActionSafeArea = styled.SafeAreaView`
  margin: ${spacing[3]}px ${spacing[4]}px;
  background-color: ${color.background};
`

export const NewRequestFooterArea: React.FC<{ step: number; children?: React.ReactNode }> = ({
  step,
  children,
}) => (
  <NewRequestActionSafeArea>
    {children}
    <ProgressIndicator currentStep={step} totalSteps={NEW_REQUEST_TOTAL_STEPS} />
  </NewRequestActionSafeArea>
)
