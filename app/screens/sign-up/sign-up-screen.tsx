import React from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { useNavigation } from "@react-navigation/core"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.grey,
  paddingHorizontal: spacing[4],
}

const FULL: ViewStyle = { flex: 1 }
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const FOOTER: ViewStyle = { marginBottom: 64 }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const BUTTON_STYLE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  marginVertical: spacing[2],
  backgroundColor: color.palette.darkBlue,
}
const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
  color: color.palette.white,
}

export const SignUpScreen = observer(function SignUpScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const navigation = useNavigation()
  const navigateBack = () => navigation.navigate("welcome")

  return (
    <View testID="SignUpScreen" style={FULL}>
      <Screen style={ROOT} preset="scroll" backgroundColor={color.transparent}>
        <Header headerTx="header.text" style={HEADER} titleStyle={HEADER_TITLE} />
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
            testID="next-screen-button"
            style={BUTTON_STYLE}
            textStyle={BUTTON_TEXT}
            tx="signUpScreen.submit"
            onPress={navigateBack}
          />
          <Button
            testID="next-screen-button"
            style={BUTTON_STYLE}
            textStyle={BUTTON_TEXT}
            tx="common.back"
            onPress={navigateBack}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
