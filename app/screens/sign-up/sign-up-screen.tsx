import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, View, ViewStyle } from "react-native"
import { Button, FormRow, Header, Screen, Text, TextField } from "../../components"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/core"
import { Switch } from "react-native-gesture-handler"
import { UserRoleEnum } from "../../types"
import { roleTypeToScreenMap } from "../../utils/navigation"

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
  const [userRole, setUserRole] = useState<UserRoleEnum>(UserRoleEnum.REQUESTER)
  const [errorMessage, setErrorMessage] = useState<string>()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handleUserRoleChange = (value) => {
    setUserRole(value ? UserRoleEnum.REQUESTER : UserRoleEnum.CHAPERONE)
  }

  const handleSubmit = async () => {
    try {
      await authStore.createUser(userEmail, userPassword, userFirstName, userLastName, userRole)
      const screen = roleTypeToScreenMap.get(authStore.user.profile.role)
      navigation.navigate(screen)
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
        <Text preset="default" tx="signUpScreen.description" />
        <FormRow preset="bottom">
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
          <Text text="Sign up as requester?" />
          <Switch
            onValueChange={handleUserRoleChange}
            value={userRole === UserRoleEnum.REQUESTER}
          />
        </FormRow>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="submit-button"
            tx="signUpScreen.submit"
            disabled={!userEmail || !userPassword}
            onPress={handleSubmit}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
