import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, View, ViewStyle } from "react-native"
import {
  Break,
  Button,
  Checkbox,
  FlexContainer,
  Header,
  Screen,
  Text,
  TextField,
} from "../../components"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/core"
import { GeoAreaEnum, UserRoleEnum } from "../../types"

const ROOT: ViewStyle = {
  flex: 1,
}

const FOOTER: ViewStyle = { backgroundColor: color.palette.offWhite }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

const DEFAULT_EMAIL = "app@compassioninoakland.org"
const DEFAULT_PASSWORD = "testing"
const DEFAULT_FIRST_NAME = "Jane"
const DEFAULT_LAST_NAME = "Tester"

export const SignUpScreen = observer(function SignUpScreen() {
  const { authStore } = useStores()
  const [userEmail, setUserEmail] = useState<string>(DEFAULT_EMAIL)
  const [userPassword, setUserPassword] = useState<string>(DEFAULT_PASSWORD)
  const [userFirstName, setUserFirstName] = useState<string>(DEFAULT_FIRST_NAME)
  const [userLastName, setUserLastName] = useState<string>(DEFAULT_LAST_NAME)
  const [userGeoArea, setUserGeoArea] = useState<GeoAreaEnum>(GeoAreaEnum.OAK1)
  const [userRole, setUserRole] = useState<UserRoleEnum>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  function isValid() {
    return userEmail && userPassword && userRole && userFirstName && userLastName && userGeoArea
  }

  const handleUserRoleChange = (role: UserRoleEnum) => (value) => {
    value ? setUserRole(role) : setUserRole(undefined)
  }

  const handleGeoAreaChange = (geoArea: GeoAreaEnum) => (value) => {
    value ? setUserGeoArea(geoArea) : setUserGeoArea(undefined)
  }

  const handleSubmit = async () => {
    if (!isValid()) {
      setErrorMessage("All fields must be entered")
      return
    }
    setErrorMessage(undefined)
    try {
      await authStore.createUser(
        userEmail,
        userPassword,
        userFirstName,
        userLastName,
        userRole,
        userGeoArea,
      )
      // Navigate to the mainStack and based on the user's type, the navigator will show the
      // appropriate home screen
      navigation.navigate("mainStack")
    } catch (err) {
      if (err.message) setErrorMessage(err.message)
    }
  }

  return (
    <View testID="SignUpScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="scroll">
        <Header
          headerTx="signUpScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        {errorMessage && <Text preset="error" text={errorMessage} />}
        <TextField
          preset="header"
          labelTx="signUpScreen.email"
          placeholderTx="signUpScreen.emailPlaceholder"
          defaultValue={userEmail}
          autoCompleteType="email"
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setUserEmail}
        />
        <TextField
          preset="header"
          labelTx="signUpScreen.password"
          placeholderTx="signUpScreen.passwordPlaceholder"
          defaultValue={userPassword}
          autoCompleteType="password"
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry
          onChangeText={setUserPassword}
        />
        <TextField
          preset="header"
          labelTx="signUpScreen.firstName"
          placeholderTx="signUpScreen.firstNamePlaceholder"
          defaultValue={userFirstName}
          autoCompleteType="name"
          onChangeText={setUserFirstName}
        />
        <TextField
          preset="header"
          labelTx="signUpScreen.lastName"
          placeholderTx="signUpScreen.lastNamePlaceholder"
          defaultValue={userLastName}
          autoCompleteType="name"
          onChangeText={setUserLastName}
        />
        <Text preset="bold" tx="signUpScreen.geoArea" />
        <FlexContainer column justifyAround>
          <Checkbox
            tx={`enumGeoArea.${GeoAreaEnum.OAK1}`}
            value={userGeoArea === GeoAreaEnum.OAK1}
            onToggle={handleGeoAreaChange(GeoAreaEnum.OAK1)}
          ></Checkbox>
          <Checkbox
            tx={`enumGeoArea.${GeoAreaEnum.SFO1}`}
            value={userGeoArea === GeoAreaEnum.SFO1}
            onToggle={handleGeoAreaChange(GeoAreaEnum.SFO1)}
          ></Checkbox>
        </FlexContainer>

        <Break />

        <Text preset="bold" tx="signUpScreen.signUpAs" />
        <FlexContainer column justifyAround>
          <Checkbox
            tx="signUpScreen.signUpRequesterOption"
            multiline
            value={userRole === UserRoleEnum.REQUESTER}
            onToggle={handleUserRoleChange(UserRoleEnum.REQUESTER)}
          ></Checkbox>
          <Checkbox
            tx="signUpScreen.signUpChaperoneOption"
            multiline
            value={userRole === UserRoleEnum.CHAPERONE}
            onToggle={handleUserRoleChange(UserRoleEnum.CHAPERONE)}
          ></Checkbox>
        </FlexContainer>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="submit-button"
            tx="signUpScreen.submit"
            disabled={!isValid()}
            onPress={handleSubmit}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
