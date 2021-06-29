import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView, View, ViewStyle } from "react-native"
import { Button, FormRow, Header, Screen, TextField, Text, FlexContainer } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"

const ROOT: ViewStyle = {
  flex: 1,
}

const FOOTER: ViewStyle = { backgroundColor: color.palette.grey }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export const ResetPasswordScreen = observer(function ResetPasswordScreen() {
  const { authStore } = useStores()

  const [saved, setSaved] = useState<boolean>(false)

  const navigation = useNavigation()

  const handlePressSave = async () => {
    setSaved(true)
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
          />
          <TextField
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            preset="header"
            labelTx="resetPasswordScreen.newPassword"
            placeholder="New Password"
          />
          <TextField
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            preset="header"
            labelTx="resetPasswordScreen.verifyNewPassword"
            placeholder="Verifty New Password"
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
      </Screen>
    </View>
  )
})
