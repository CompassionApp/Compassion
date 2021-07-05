import styled from "styled-components/native"
import { Button, FlexContainer, Text } from "../../components"
import { color, spacing } from "../../theme"

export const MatchProfilePhotos = styled.View<{ color?: string }>`
  background-color: ${({ color: _color }) => _color ?? color.palette.grey};
  padding: ${spacing[4]}px;
  margin: ${spacing[2]}px 0;
`

export const DebugText = styled(Text)`
  color: ${color.dim};
`

export const UNMATCHED_TEXT_STYLE = {
  color: color.palette.red,
}
export const MATCHED_TEXT_STYLE = {
  color: color.palette.white,
}

export const ButtonRow = styled(FlexContainer)`
  margin: ${spacing[2]}px auto;
`

export const LinkButton = styled(Button)<{ faded?: boolean }>`
  margin: ${spacing[2]}px auto;
  ${({ faded }) => (faded ? `opacity: .3;` : "")}
  margin-horizontal: auto;
`

export const OtherCommentsArea = styled(FlexContainer)`
  padding: ${spacing[3]}px ${spacing[2]}px;
`
