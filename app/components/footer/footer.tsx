import React from "react"
import { ViewStyle, TextStyle, ImageStyle } from "react-native"
import styled from "styled-components/native"
import { Button } from "../button/button"
import { Icon } from "../icon/icon"
import { color, spacing } from "../../theme"
import { translate, TxKeyPath } from "../../i18n"
import { useNavigation } from "@react-navigation/native"

// static styles
const Container = styled.View`
  background-color: ${color.palette.white};
  flex-direction: row;
  padding-horizontal: ${spacing[6]};
  align-items: center;
  padding-top: ${spacing[2]};
  padding-bottom: ${spacing[3]};
  justify-content: space-between;
`
const ICON_STYLE: ImageStyle = {
  width: 35,
}

export interface FooterProps {
  /**
   * Main footer, e.g. POWERED BY IGNITE
   */
  footerTx?: TxKeyPath

  /**
   * footer non-i18n
   */
  footerText?: string

  /**
   * Container style overrides.
   */
  style?: ViewStyle

  /**
   * Title style overrides.
   */
  titleStyle?: TextStyle
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Footer(props: FooterProps) {
  const { footerText, footerTx, style } = props
  const footer = footerText || (footerTx && translate(footerTx)) || ""
  const navigation = useNavigation()
  const handlePressHome = () => {
    navigation.navigate("home")
  }
  const handlePressRequest = () => {
    navigation.navigate("requester")
  }

  return (
    <Container style={{ ...style }}>
      <Button preset="link" onPress={handlePressHome}>
        <Icon icon="home" style={ICON_STYLE} />
      </Button>
      <Button preset="link" onPress={handlePressRequest}>
        <Icon icon="request" style={ICON_STYLE} />
      </Button>
      <Button preset="link" onPress={handlePressHome}>
        <Icon icon="menu" style={ICON_STYLE} />
      </Button>
    </Container>
  )
}
