import React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, TextField } from "../../components"
import { color, globalStyles, spacing, typography } from "../../theme"
export const logo = require("./logo.png")

const ROOT: ViewStyle = {
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}

const LOGO_IMAGE: ImageStyle = {
  marginBottom: spacing[3],
  alignSelf: "center",
  width: 200,
  height: 200,
}

const CONTENT: TextStyle = {
  ...TEXT,
  color: "#222",
  fontSize: 15,
  lineHeight: 22,
  marginTop: spacing[3],
  marginBottom: spacing[5],
}
const FOOTER: ViewStyle = {
  marginBottom: 64,
}
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export const WelcomeScreen = observer(function WelcomeScreen() {
  const navigation = useNavigation()
  const navigateSignUp = () => navigation.navigate("signup")
  const navigateRoleSelect = () => navigation.navigate("roleSelect")

  return (
    <View testID="WelcomeScreen" style={globalStyles.full}>
      {/* <Wallpaper /> */}
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="scroll">
        <Header style={globalStyles.header} titleStyle={globalStyles.headerTitle} />
        <Image source={logo} resizeMethod="auto" style={LOGO_IMAGE} />
        <Text style={TITLE_WRAPPER}>
          <Text style={globalStyles.title} text="Compassion In Oakland" />
        </Text>
        <Text style={CONTENT} tx="welcomeScreen.missionStatement"></Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <TextField preset="header" labelTx="welcomeScreen.loginEmail" />
          <TextField preset="header" labelTx="welcomeScreen.loginPassword" />
          <Button
            testID="next-screen-button"
            style={globalStyles.button}
            textStyle={globalStyles.buttonText}
            tx="welcomeScreen.login"
            onPress={navigateRoleSelect}
          />
          <Button
            testID="next-screen-button"
            style={globalStyles.button}
            textStyle={globalStyles.buttonText}
            tx="welcomeScreen.signUpVolunteer"
            onPress={navigateSignUp}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
