import React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, TextField } from "../../components"
import { color, spacing, typography } from "../../theme"
export const logo = require("./logo.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.grey,
  paddingHorizontal: spacing[4],
}
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
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
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
const FOOTER: ViewStyle = {
  // backgroundColor: color.palette.lighterGrey,
  marginBottom: 64,
}
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export const WelcomeScreen = observer(function WelcomeScreen() {
  const navigation = useNavigation()
  const navigateSignUp = () => navigation.navigate("signup")
  const navigateChaperone = () => navigation.navigate("chaperone")

  return (
    <View testID="WelcomeScreen" style={FULL}>
      {/* <Wallpaper /> */}
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header style={HEADER} titleStyle={HEADER_TITLE} />
        <Image source={logo} resizeMethod="auto" style={LOGO_IMAGE} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Compassion In Oakland" />
        </Text>
        <Text style={CONTENT}>
          We strive to provide the Oakland Chinatown Community with a resource for promoting safety
          and community. We aim to embrace the often forgotten, underserved, and vulnerable. We
          promote compassion not indifference, unity as opposed to divisiveness. Fostering a more
          caring and safer Oakland for all.
        </Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <TextField preset="header" labelTx="welcomeScreen.loginEmail" />
          <TextField preset="header" labelTx="welcomeScreen.loginPassword" />
          <Button
            testID="next-screen-button"
            style={BUTTON_STYLE}
            textStyle={BUTTON_TEXT}
            tx="welcomeScreen.login"
            onPress={navigateChaperone}
          />
          <Button
            testID="next-screen-button"
            style={BUTTON_STYLE}
            textStyle={BUTTON_TEXT}
            tx="welcomeScreen.signUpVolunteer"
            onPress={navigateSignUp}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
