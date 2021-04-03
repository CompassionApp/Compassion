import React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, FormRow, Header, Screen, Text, TextField } from "../../components"
import { color, globalStyles, spacing, typography } from "../../theme"
export const logo = require("./logo.png")

const ROOT: ViewStyle = {
  flex: 1,
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
const TITLE: TextStyle = {
  fontWeight: "bold",
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
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
  backgroundColor: color.palette.grey,
}
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[4],
}

export const WelcomeScreen = observer(function WelcomeScreen() {
  const navigation = useNavigation()
  const navigateSignUp = () => navigation.navigate("signup")
  const navigateRoleSelect = () => navigation.navigate("roleSelect")
  const navigateDemo = () => navigation.navigate("demoList")

  return (
    <View testID="WelcomeScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }}>
        <Header style={globalStyles.header} />
        <Image source={logo} resizeMethod="auto" style={LOGO_IMAGE} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Compassion In Oakland" />
        </Text>
        <Text style={CONTENT} tx="welcomeScreen.missionStatement"></Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <FormRow preset="bottom">
            <TextField preset="header" labelTx="welcomeScreen.loginEmail" />
            <TextField preset="header" labelTx="welcomeScreen.loginPassword" />
          </FormRow>

          <Button
            testID="next-screen-button"
            tx="welcomeScreen.login"
            onPress={navigateRoleSelect}
          />
          <Button
            testID="next-screen-button"
            tx="welcomeScreen.signUpVolunteer"
            onPress={navigateSignUp}
          />
          <Button
            preset="link"
            testID="next-screen-button"
            // style={{ ...globalStyles.buttonSecondary, borderWidth: 0 }}
            // textStyle={{
            //   color: color.palette.darkBlue,
            //   fontSize: 13,
            // }}
            text="See demo page"
            onPress={navigateDemo}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
