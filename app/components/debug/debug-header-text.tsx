import styled from "styled-components/native"
import { Text } from ".."
import { color, spacing } from "../../theme"

export const DebugHeaderText = styled(Text)`
  color: ${color.dim};
  margin-top: ${spacing[3]}px;
  margin-bottom: ${spacing[2]}px;
`
