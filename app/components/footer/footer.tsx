import React from "react"
import { ImageStyle } from "react-native"
import styled from "styled-components/native"
import { Button } from "../button/button"
import { Icon } from "../icon/icon"
import { color, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"

// static styles
const Container = styled.View`
  background-color: ${color.palette.white};
  flex-direction: row;
  padding-horizontal: ${spacing[6]}px;
  align-items: center;
  padding-top: ${spacing[2]}px;
  padding-bottom: ${spacing[3]}px;
  justify-content: space-between;
`
const ICON_STYLE: ImageStyle = {
  width: 35,
}

export interface FooterProps {}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Footer() {
  const navigation = useNavigation()
  const handlePressHome = () => {
    navigation.navigate("home")
  }
  const handlePressRequest = () => {
    navigation.navigate("newRequest")
  }
  const handlePressNotifications = () => {
    // TODO: Change when we have a notification screen
    navigation.navigate("home")
  }

  return (
    <Container>
      <Button preset="link" onPress={handlePressHome}>
        <Icon icon="home" style={ICON_STYLE} />
      </Button>
      <Button preset="link" onPress={handlePressRequest}>
        <Icon icon="request" style={ICON_STYLE} />
      </Button>
      <Button preset="link" onPress={handlePressNotifications}>
        <Icon icon="notification" style={ICON_STYLE} />
      </Button>
      <Button preset="link" onPress={handlePressHome}>
        <Icon icon="menu" style={ICON_STYLE} />
      </Button>
    </Container>
  )
}
