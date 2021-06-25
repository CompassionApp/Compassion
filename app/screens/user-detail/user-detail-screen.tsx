import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"
import {
  Break,
  Button,
  FlexContainer,
  FlexItem,
  Header,
  Screen,
  Text,
  TextField,
} from "../../components"
import { color, globalStyles, spacing } from "../../theme"
import { UserProfileSnapshot, useStores } from "../../models"
import { UserRoleEnum } from "../../types"
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../constants"
import { format } from "date-fns"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}
const RoleBadge = styled(Text)<{ color?: string }>`
  padding-horizontal: ${spacing[1]}px;
  color: ${({ color: _color }) => _color || color.palette.grey3};
  font-size: 12px;
  text-transform: uppercase;
`

const Check = () => <Ionicons name="md-checkmark-circle" size={20} color={color.palette.green} />

const mapRoleToColor = new Map<UserRoleEnum, string>([
  [UserRoleEnum.REQUESTER, color.palette.darkBlue],
  [UserRoleEnum.ADMIN, color.palette.darkRed],
  [UserRoleEnum.CHAPERONE, color.palette.darkGreen],
])

export const UserDetailScreen = observer(function UserDetailScreen() {
  const { usersStore } = useStores()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  if (!usersStore.selectedUser) {
    return (
      <View testID="UserDetailScreen" style={globalStyles.full}>
        <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
          <Header
            headerTx="homeScreen.title"
            leftIcon="back"
            onLeftPress={navigateBack}
            style={globalStyles.header}
          />
          <Text>Invalid user.</Text>
        </Screen>
      </View>
    )
  }

  const [profile, setProfile] = useState<UserProfileSnapshot>(usersStore.selectedUser)

  const handlePressSave = () => {
    console.log("save profile", profile)
  }

  const handleChangeValue = (key: keyof UserProfileSnapshot) => (value: string) => {
    setProfile({ ...profile, [key]: value })
  }

  return (
    <View testID="UserDetailScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="userDetailScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <FlexContainer>
          <Text preset={["header", "bold"]}>
            {usersStore.selectedUser.firstName} {usersStore.selectedUser.lastName}
          </Text>
          <RoleBadge
            color={mapRoleToColor.get(usersStore.selectedUser.role)}
            tx={`enumUserRole.${usersStore.selectedUser.role}`}
          />
        </FlexContainer>
        <Break />
        <FlexContainer justifyBetween>
          <FlexItem basis="49%">
            <TextField
              labelTx="userDetailScreen.firstNameLabel"
              value={profile.firstName}
              onChangeText={handleChangeValue("firstName")}
            />
          </FlexItem>
          <FlexItem basis="49%">
            <TextField
              labelTx="userDetailScreen.lastNameLabel"
              value={profile.lastName}
              onChangeText={handleChangeValue("lastName")}
            />
          </FlexItem>
        </FlexContainer>
        <TextField
          labelTx="userDetailScreen.emailLabel"
          value={profile.email}
          onChangeText={handleChangeValue("email")}
        />
        <TextField
          labelTx="userDetailScreen.phoneNumberLabel"
          value={profile.phoneNumber}
          onChangeText={handleChangeValue("phoneNumber")}
        />
        <Text>
          Status: <Text tx={`enumUserStatus.${profile.status}`} />
        </Text>
        <Text>
          Geo Area: <Text tx={`enumGeoArea.${profile.geoArea}`} />
        </Text>
        <Break />
        <Text preset="smallHeader">Checks</Text>
        <Text>
          Code of Conduct:{" "}
          {profile.signedCodeOfConductAt && (
            <>
              <Check />
              {format(new Date(profile.signedCodeOfConductAt), DEFAULT_DATE_FORMAT)}
            </>
          )}
        </Text>
        <Text>
          User Agreement:{" "}
          {profile.acceptedUserAgreementAt && (
            <>
              <Check />
              {format(new Date(profile.acceptedUserAgreementAt), DEFAULT_DATE_FORMAT)}
            </>
          )}
        </Text>
        <Text>
          COVID Test:{" "}
          {profile.latestCovidTestVerifiedAt && (
            <>
              <Check />
              {format(new Date(profile.latestCovidTestVerifiedAt), DEFAULT_DATE_FORMAT)}
            </>
          )}
        </Text>
        <Break />
        <Text preset="smallHeader">Stats</Text>
        <Text>Created at: {format(new Date(profile.createdAt), DEFAULT_DATE_TIME_FORMAT)}</Text>
        <Text>Updated at: {format(new Date(profile.updatedAt), DEFAULT_DATE_TIME_FORMAT)}</Text>
        <Text>
          Last Login at: {format(new Date(profile.lastLoginAt), DEFAULT_DATE_TIME_FORMAT)}
        </Text>

        <SafeAreaView>
          <Button tx="userDetailScreen.saveButton" onPress={handlePressSave} />
        </SafeAreaView>
      </Screen>
    </View>
  )
})
