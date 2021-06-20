import styled from "styled-components/native"

export interface FlexContainerProps {
  column?: boolean
  width?: string
  justifyCenter?: boolean
  justifyStart?: boolean
  justifyEnd?: boolean
  justifyBetween?: boolean
  justifyAround?: boolean
  marginHorizontal?: string
  marginVertical?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
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
  ${({ justifyBetween }) => (justifyBetween ? "justify-content: space-between;" : "")}
  ${({ justifyAround }) => (justifyAround ? "justify-content: space-around;" : "")}
  ${({ marginHorizontal }) =>
    marginHorizontal ? `margin-left: ${marginHorizontal}; margin-right: ${marginHorizontal};` : ""}
  ${({ marginVertical }) =>
    marginVertical ? `margin-top: ${marginVertical}; margin-bottom: ${marginVertical};` : ""}
    ${({ marginTop }) => (marginTop ? `margin-top: ${marginTop};` : "")}
  ${({ marginRight }) => (marginRight ? `margin-right: ${marginRight};` : "")}
  ${({ marginBottom }) => (marginBottom ? `margin-bottom: ${marginBottom};` : "")}
  ${({ marginLeft }) => (marginLeft ? `margin-left: ${marginLeft};` : "")}
`

export interface FlexItemProps {
  flow?: number
  grow?: number
  shrink?: number
  basis?: string
  width?: string
  justifyCenter?: boolean
  justifyStart?: boolean
  justifyEnd?: boolean
  justifyBetween?: boolean
  justifyAround?: boolean
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
  ${({ justifyCenter }) => (justifyCenter ? "justify-content: center;" : "")}
  ${({ justifyStart }) => (justifyStart ? "justify-content: flex-start;" : "")}
  ${({ justifyEnd }) => (justifyEnd ? "justify-content: flex-end;" : "")}
  ${({ justifyBetween }) => (justifyBetween ? "justify-content: space-between;" : "")}
  ${({ justifyAround }) => (justifyAround ? "justify-content: space-around;" : "")}
  ${({ alignCenter }) => (alignCenter ? "align-self: center;" : "")}
  ${({ alignStart }) => (alignStart ? "align-self: flex-start;" : "")}
  ${({ alignEnd }) => (alignEnd ? "align-self: flex-end;" : "")}
`
