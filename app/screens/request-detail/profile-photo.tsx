import React from "react"
import { TextStyle } from "react-native"
import styled from "styled-components/native"
import { Text } from "../../components"
import { spacing } from "../../theme"
const profile = require("./profile.png")

const SIZE = 70
const Container = styled.View`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: ${spacing[2]}px;
`

const PhotoContainer = styled.View`
  border-radius: 100px;
  background-color: #c4c4c4;
  width: ${SIZE}px;
  height: ${SIZE}px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-self: center;
`
const PhotoInnerContainer = styled.View`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`
const NameContainer = styled.View`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin-top: ${spacing[2]}px;
`

const ProfileImage = styled.Image`
  width: ${SIZE * 0.6}px;
  height: ${SIZE * 0.6}px;
`

export interface RequestDetailProfilePhotoProps {
  name?: string
  style?: TextStyle
}

export const RequestDetailProfilePhoto: React.FC<RequestDetailProfilePhotoProps> = ({
  name,
  style,
}) => (
  <Container>
    <PhotoContainer>
      <PhotoInnerContainer>
        <ProfileImage source={profile} />
      </PhotoInnerContainer>
    </PhotoContainer>
    {name && (
      <NameContainer>
        <Text preset="bold" style={style}>
          {name}
        </Text>
      </NameContainer>
    )}
  </Container>
)
