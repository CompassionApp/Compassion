import styled from "styled-components/native"

export interface FlexContainerProps {
  column?: boolean
  width?: string
  justifyCenter?: boolean
  justifyStart?: boolean
  justifyEnd?: boolean
}

/**
 * Flexbox component
 */
export const FlexContainer = styled.View<FlexContainerProps>`
  display: flex;
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  ${({ width }) => (width ? `width: ${width};` : "")}
  ${({ justifyCenter }) => (justifyCenter ? "justify-content: center;" : "")}
  ${({ justifyStart }) => (justifyStart ? "justify-content: flex-start;" : "")}
  ${({ justifyEnd }) => (justifyEnd ? "justify-content: flex-end;" : "")}
`

export interface FlexItemProps {
  flow?: number
  grow?: number
  shrink?: number
  basis?: string
  width?: string
  alignCenter?: boolean
  alignStart?: boolean
  alignEnd?: boolean
}

/**
 * Flexbox component
 */
export const FlexItem = styled.View<FlexItemProps>`
  ${({ width }) => width ?? ""};
  ${({ basis }) => (basis ? `flex-basis: ${basis};` : "")}
  ${({ grow }) => (grow ? `flex-grow: ${grow};` : "")}
  ${({ shrink }) => (shrink ? `flex-shrink: ${shrink};` : "")}
  ${({ alignCenter }) => (alignCenter ? "align-self: center;" : "")}
  ${({ alignStart }) => (alignStart ? "align-self: flex-start;" : "")}
  ${({ alignEnd }) => (alignEnd ? "align-self: flex-end;" : "")}
`
