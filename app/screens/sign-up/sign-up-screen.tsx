import React from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { globalStyles, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/core"

const ROOT: ViewStyle = {}

const FOOTER: ViewStyle = { marginBottom: 64 }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export const SignUpScreen = observer(function SignUpScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  return (
    <View testID="SignUpScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="scroll">
        <Header
          headerTx="header.text"
          style={globalStyles.header}
          titleStyle={globalStyles.headerTitle}
        />
        <Text preset="header" tx="signUpScreen.title" />
        <TextField preset="header" labelTx="signUpScreen.firstName" placeholder="John" />
        <TextField preset="header" labelTx="signUpScreen.lastName" placeholder="Doe" />
        <TextField preset="header" labelTx="signUpScreen.phone" placeholder="111 222 3333" />
        <TextField preset="header" labelTx="signUpScreen.dateOfBirth" placeholder="1/1/2021" />
        <TextField preset="header" labelTx="signUpScreen.email" placeholder="john.doe@gmail.com" />
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="submit-button"
            style={globalStyles.button}
            textStyle={globalStyles.buttonText}
            tx="signUpScreen.submit"
            onPress={navigateBack}
          />
          <Button
            testID="back-button"
            style={globalStyles.buttonSecondary}
            textStyle={globalStyles.buttonSecondaryText}
            tx="common.back"
            onPress={navigateBack}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
