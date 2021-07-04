import React, { useState } from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Image, ImageStyle, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, FlexContainer, Header, Screen, Text, TextField } from "../../components"
import { color, globalStyles, spacing, typography } from "../../theme"
import { useStores } from "../../models"
import { UserRoleEnum } from "../../types"
export const logo = require("./logo-text.png")

const SHOW_DEV_BUTTONS = true

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}

const LOGO_IMAGE: ImageStyle = {
  marginBottom: spacing[1],
  alignSelf: "center",
  width: (237 * 5) / 6,
  height: (337 * 5) / 6,
}

const CONTENT: TextStyle = {
  ...TEXT,
  color: "#222",
  fontSize: 15,
  lineHeight: 22,
  textAlign: "center",
  marginTop: spacing[4],
  marginBottom: spacing[5],
}
const FOOTER: ViewStyle = {
  backgroundColor: color.background,
}
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[4],
}

/** Remove these later when not launching */
const DEFAULT_USERNAME = "app@compassioninoakland.org"
const DEFAULT_PASSWORD = "testing"

export const WelcomeScreen = observer(function WelcomeScreen() {
  const navigation = useNavigation()
  const navigateSignUp = () => navigation.navigate("signup")
  const navigatePermissions = () => navigation.navigate("permissions")

  const { authStore, clearStorage } = useStores()
  const [userEmail, setUserEmail] = useState<string>(DEFAULT_USERNAME)
  const [userPassword, setUserPassword] = useState<string>(DEFAULT_PASSWORD)
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>("")
  /** Prevents the user from spamming log in while a request is pending */
  const [loginInProgress, setLoginInProgress] = useState<boolean>(false)

  const handleLogin = async (userEmail: string, userPassword: string) => {
    try {
      console.log("Logging in with", userEmail, userPassword)
      setLoginInProgress(true)
      await authStore.signIn(userEmail, userPassword)

      navigation.navigate("mainStack")
      setLoginErrorMessage("")
      setLoginInProgress(false)
    } catch (ex) {
      setLoginInProgress(false)
      setLoginErrorMessage(ex.message)
    }
  }

  const handleClear = () => {
    Alert.alert(
      "Reset store",
      "Are you sure you want to clear storage? This should only be used for debugging purposes.",
      [
        { text: "Yes", onPress: () => clearStorage() },
        {
          text: "No",
          style: "cancel",
        },
      ],
    )
  }

  const handleDevLoginAs = (role: UserRoleEnum) => () => {
    let userEmail
    let userPassword

    switch (role) {
      case UserRoleEnum.REQUESTER:
        userEmail = "app@compassioninoakland.org"
        userPassword = "testing"
        break
      case UserRoleEnum.CHAPERONE:
        userEmail = "app2@compassioninoakland.org"
        userPassword = "testing"
        break
      case UserRoleEnum.ADMIN:
        userEmail = "app3@compassioninoakland.org"
        userPassword = "testing"
        break
    }
    setUserEmail(userEmail)
    setUserPassword(userPassword)
    handleLogin(userEmail, userPassword)
  }

  return (
    <View testID="WelcomeScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }}>
        <Header style={globalStyles.header} />
        <Image source={logo} resizeMethod="auto" style={LOGO_IMAGE} />
        <Text style={CONTENT} tx="welcomeScreen.missionStatement"></Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          {!!loginErrorMessage && <Text preset="error" text={loginErrorMessage} />}
          {SHOW_DEV_BUTTONS && (
            <FlexContainer justifyBetween>
              <Button
                text="Requester"
                preset="ghost"
                disabled={loginInProgress}
                onPress={handleDevLoginAs(UserRoleEnum.REQUESTER)}
              />
              <Button
                text="Chaperone"
                preset="ghost"
                disabled={loginInProgress}
                onPress={handleDevLoginAs(UserRoleEnum.CHAPERONE)}
              />
              <Button
                text="Admin"
                preset="ghost"
                disabled={loginInProgress}
                onPress={handleDevLoginAs(UserRoleEnum.ADMIN)}
              />
            </FlexContainer>
          )}
          <TextField
            preset="header"
            onChangeText={(text) => setUserEmail(text)}
            autoCorrect={false}
            autoCapitalize="none"
            defaultValue={userEmail}
            labelTx="welcomeScreen.loginEmail"
          />
          <TextField
            preset="header"
            onChangeText={(text) => setUserPassword(text)}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            defaultValue={userPassword}
            labelTx="welcomeScreen.loginPassword"
          />
          <Button
            testID="login-button"
            tx="welcomeScreen.login"
            onPress={() => handleLogin(userEmail, userPassword)}
            disabled={loginInProgress || !userEmail || !userPassword}
          />
          <Button
            testID="register-button"
            tx="welcomeScreen.signUpVolunteer"
            onPress={navigateSignUp}
            disabled={loginInProgress}
            preset="ghost"
          />
          <FlexContainer justifyBetween>
            <Button
              preset="link"
              testID="next-screen-button"
              text="Permissions"
              onPress={navigatePermissions}
            />
            <Button preset="link" text="Reset" onPress={handleClear} />
          </FlexContainer>
        </View>
      </SafeAreaView>
    </View>
  )
})
