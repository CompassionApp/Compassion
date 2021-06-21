import React from "react"
import { TextStyle } from "react-native"
import styled from "styled-components/native"
import { FlexContainer, Text } from "../../components"
import { UserProfilePreview } from "../../models"
import { color, spacing } from "../../theme"
const profileImage = require("./profile.png")

const SIZE = 70
const Container = styled(FlexContainer)`
  margin: ${spacing[2]}px;
`

const PhotoContainer = styled(FlexContainer)`
  border-radius: 100px;
  background-color: ${color.palette.grey2};
  width: ${SIZE}px;
  height: ${SIZE}px;
  align-self: center;
`
const PhotoInnerContainer = styled(FlexContainer)``
const NameContainer = styled(FlexContainer)`
  margin-top: ${spacing[2]}px;
`

const ProfileImage = styled.Image`
  width: ${SIZE * 0.6}px;
  height: ${SIZE * 0.6}px;
`

export interface RequestDetailProfilePhotoProps {
  previewProfile?: UserProfilePreview
  style?: TextStyle
}

export const RequestDetailProfilePhoto: React.FC<RequestDetailProfilePhotoProps> = ({
  previewProfile,
  style,
}) => (
  <Container justifyCenter column>
    <PhotoContainer justifyCenter>
      <PhotoInnerContainer column justifyCenter>
        <ProfileImage source={profileImage} />
      </PhotoInnerContainer>
    </PhotoContainer>
    {previewProfile && (
      <NameContainer justifyCenter>
        <Text preset="bold" style={style}>
          {previewProfile.fullName}
        </Text>
      </NameContainer>
    )}
  </Container>
)
