import { spacing } from "../../theme"
import styled from "styled-components/native"

export interface BreakProps {
  /**
   * An optional size for the break. Use 1-10 per the `spacing` constants for the theme.
   */
  size?: number | undefined
}

/**
 * A vertical line break
 */
export const Break = styled.View<{ size?: number | undefined }>`
  margin: ${({ size = 2 }) => spacing[size]}px 0;
`
