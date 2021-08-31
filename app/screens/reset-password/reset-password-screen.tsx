import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView, View, ViewStyle } from "react-native"
import { Button, FormRow, Header, Screen, TextField, Text, FlexContainer } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { empty } from "ramda"

const ROOT: ViewStyle = {
  flex: 1,
}

export const ResetPasswordScreen = observer(function ResetPasswordScreen() {
  const { authStore } = useStores()

  const [saved, setSaved] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [tooManyAttemptsError, setTooManyAttemptsError] = useState<boolean>(false)
  const [verifyError, setVerifyError] = useState<boolean>(false)
  const [weakPasswordError, setWeakPasswordError] = useState<boolean>(false)
  const [passwordIncorrectError, setPasswordIncorrectError] = useState<boolean>(false)
  const [oldPassword, setOldPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [newVerifyPassword, setNewVerifyPassword] = useState<string>("")

  const navigation = useNavigation()

  const handleChangeOldPassword = (text) => {
    setOldPassword(text)
    setSaved(false)
  }

  const handleChangeNewPassword = (text) => {
    setNewPassword(text)
    setSaved(false)
  }

  const handleChangeNewVerifyPassword = (text) => {
    setNewVerifyPassword(text)
    setSaved(false)
  }

  const handlePressSave = async () => {
    try {
      if (newPassword.localeCompare(newVerifyPassword) !== 0) {
        throw new Error("New passwords don't match")
      }

      await authStore.updatePassword(oldPassword, newPassword)

      setSaved(true)
    } catch (e) {
      __DEV__ && console.tron.log(error)
      console.log(e)

      setError(false)
      setVerifyError(false)
      setPasswordIncorrectError(false)
      setWeakPasswordError(false)

      switch (e.message) {
        case "New passwords don't match":
          setVerifyError(true)
          break
        case "Error while signing in":
          // This usually means too many attempts occurred and the user needs to wait before trying again
          setError(true)
          break
        case "Error: The password is invalid or the user does not have a password.":
          setPasswordIncorrectError(true)
          break
        case "Error: Password should be at least 6 characters":
          setWeakPasswordError(true)
          break
        case "Error: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.":
          setTooManyAttemptsError(true)
          break
        default:
          setError(true)
          break
      }
    }
  }

  return (
    <View testID="ResetPasswordScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="resetPasswordScreen.title"
          leftIcon="back"
          onLeftPress={() => navigation.goBack()}
          style={globalStyles.header}
        />
        <FormRow preset="bottom">
          <TextField
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            preset="header"
            labelTx="resetPasswordScreen.oldPassword"
            placeholder="Old Password"
            onChangeText={handleChangeOldPassword}
          />
          <TextField
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            preset="header"
            labelTx="resetPasswordScreen.newPassword"
            placeholder="New Password"
            onChangeText={handleChangeNewPassword}
          />
          <TextField
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            preset="header"
            labelTx="resetPasswordScreen.verifyNewPassword"
            placeholder="Verify New Password"
            onChangeText={handleChangeNewVerifyPassword}
          />
        </FormRow>
        <Button
          testID="ResetPasswordButton"
          tx="resetPasswordScreen.submitButton"
          onPress={handlePressSave}
        />
        {saved && (
          <FlexContainer justifyCenter>
            <Ionicons name="md-checkmark-circle" size={20} color={color.palette.green} />
            <FlexContainer marginLeft={`${spacing[2]}px`}>
              <Text preset={["center"]} tx="resetPasswordScreen.savedNotice" />
            </FlexContainer>
          </FlexContainer>
        )}
        {error && (
          <FlexContainer justifyCenter>
            <Ionicons name="close-circle" size={20} color={color.palette.red} />
            <FlexContainer marginLeft={`${spacing[2]}px`}>
              <Text preset={["center"]} tx="resetPasswordScreen.errorNotice" />
            </FlexContainer>
          </FlexContainer>
        )}
        {verifyError && (
          <FlexContainer justifyCenter>
            <Ionicons name="close-circle" size={20} color={color.palette.red} />
            <FlexContainer marginLeft={`${spacing[2]}px`}>
              <Text preset={["center"]} tx="resetPasswordScreen.verifyErrorNotice" />
            </FlexContainer>
          </FlexContainer>
        )}
        {passwordIncorrectError && (
          <FlexContainer justifyCenter>
            <Ionicons name="close-circle" size={20} color={color.palette.red} />
            <FlexContainer marginLeft={`${spacing[2]}px`}>
              <Text preset={["center"]} tx="resetPasswordScreen.passwordIncorrectErrorNotice" />
            </FlexContainer>
          </FlexContainer>
        )}
        {weakPasswordError && (
          <FlexContainer justifyCenter>
            <Ionicons name="close-circle" size={20} color={color.palette.red} />
            <FlexContainer marginLeft={`${spacing[2]}px`}>
              <Text preset={["center"]} tx="resetPasswordScreen.weakPasswordErrorNotice" />
            </FlexContainer>
          </FlexContainer>
        )}
        {tooManyAttemptsError && (
          <FlexContainer justifyCenter>
            <Ionicons name="close-circle" size={20} color={color.palette.red} />
            <FlexContainer marginLeft={`${spacing[2]}px`}>
              <Text preset={["center"]} tx="resetPasswordScreen.tooManyAttemptsErrorNotice" />
            </FlexContainer>
          </FlexContainer>
        )}
      </Screen>
    </View>
  )
})
