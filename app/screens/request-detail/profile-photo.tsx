import React from "react"
import { Alert, Linking, TextStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import styled from "styled-components/native"
import { MaterialIcons } from "@expo/vector-icons"
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

const CallableIndicatorContainer = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: ${color.palette.darkGreen};
  border-radius: 100px;
  padding: ${spacing[1]}px;
`

const ProfileImage = styled.Image`
  width: ${SIZE * 0.6}px;
  height: ${SIZE * 0.6}px;
`

export interface RequestDetailProfilePhotoProps {
  previewProfile?: UserProfilePreview
  allowCalls?: boolean
  style?: TextStyle
}

export const RequestDetailProfilePhoto: React.FC<RequestDetailProfilePhotoProps> = ({
  previewProfile,
  allowCalls = true,
  style,
}) => {
  const handlePressPhoto = () => {
    Alert.alert("Call User", `Call ${previewProfile?.fullName}?`, [
      { text: "Yes", onPress: () => Linking.openURL(`tel://${previewProfile.phoneNumber}`) },
      {
        text: "No",
        style: "cancel",
      },
    ])
  }

  return (
    <TouchableOpacity onPress={allowCalls && previewProfile?.phoneNumber ? handlePressPhoto : null}>
      <Container justifyCenter column>
        <PhotoContainer justifyCenter>
          <PhotoInnerContainer column justifyCenter>
            <ProfileImage source={profileImage} />
          </PhotoInnerContainer>
          {allowCalls && previewProfile?.phoneNumber && (
            <CallableIndicatorContainer>
              <MaterialIcons name="phone" color={color.palette.offWhite} size={14} />
            </CallableIndicatorContainer>
          )}
        </PhotoContainer>
        {previewProfile && (
          <NameContainer justifyCenter>
            <Text preset="bold" style={style}>
              {previewProfile?.fullName}
            </Text>
          </NameContainer>
        )}
      </Container>
    </TouchableOpacity>
  )
}
