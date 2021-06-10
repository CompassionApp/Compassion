import React, { useState } from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, FormRow, Header, Screen, Text, TextField } from "../../components"
import { color, globalStyles, spacing, typography } from "../../theme"
import { useStores } from "../../models"
import { roleTypeToScreenMap } from "../../utils/navigation"
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
  marginBottom: spacing[1],
  alignSelf: "center",
  width: 175,
  height: 175,
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

const ROW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
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

  const handleLogin = async () => {
    try {
      setLoginInProgress(true)
      await authStore.signIn(userEmail, userPassword)

      const { profile } = authStore.user
      const screen = roleTypeToScreenMap.get(profile.role)
      navigation.navigate(screen)
      setLoginErrorMessage("")
      setLoginInProgress(false)
    } catch (ex) {
      setLoginInProgress(false)
      setLoginErrorMessage(ex.message)
    }
  }

  const handleClear = () => {
    clearStorage()
  }

  // // Example: fetch data on first screen render
  // useEffect(() => {
  //   ;(() => {
  //     exampleStore
  //       .getUser(userID)
  //       .then((doc) => {
  //         const data = doc.data()

  //         setUserEmail(data.email)
  //         setUserPassword(data.password)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //   })()
  // }, [])

  // // Example: Listen to realtime changes in the db
  // exampleStore.environment.firebaseApi.firestore
  //   .collection("users")
  //   .doc(userID)
  //   .onSnapshot((doc) => {
  //     setDataToDisplay(doc.data().email)
  //     console.log("Current data: ", doc.data())
  //   })

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
            {!!loginErrorMessage && <Text preset="error" text={loginErrorMessage} />}
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
          </FormRow>
          <Button
            testID="next-screen-button"
            tx="welcomeScreen.login"
            onPress={handleLogin}
            disabled={loginInProgress || !userEmail || !userPassword}
          />
          <Button
            testID="next-screen-button"
            tx="welcomeScreen.signUpVolunteer"
            onPress={navigateSignUp}
          />
          <View style={ROW}>
            <Button
              preset="link"
              testID="next-screen-button"
              text="Permissions"
              onPress={navigatePermissions}
            />
            <Button preset="link" text="Reset Storage" onPress={handleClear} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
})
