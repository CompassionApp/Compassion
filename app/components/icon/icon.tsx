import * as React from "react"
import { Image, ImageStyle } from "react-native"
import styled from "styled-components/native"
import { IconProps } from "./icon.props"
import { icons } from "./icons"

const Container = styled.View``

const ROOT: ImageStyle = {
  resizeMode: "contain",
}

export function Icon(props: IconProps) {
  const { style: styleOverride, icon, containerStyle } = props
  const style: ImageStyle = { ...ROOT, ...styleOverride }

  return (
    <Container style={containerStyle}>
      <Image style={style} source={icons[icon]} />
    </Container>
  )
}
