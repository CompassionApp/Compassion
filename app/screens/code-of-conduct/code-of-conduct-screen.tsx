import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, View, ViewStyle, StyleSheet } from "react-native"
import {
  Break,
  Button,
  FlexContainer,
  Header,
  Screen,
  Text,
  Checkbox,
  TextField,
} from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles } from "../../theme"
import { ScrollView } from "react-native-gesture-handler"
import { useStores } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const CodeOfConductScreen = observer(function CodeOfConductScreen() {
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const [isChecked, setChecked] = useState(false)
  const [userFullName, setUserFullName] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const { authStore } = useStores()

  function isValid() {
    return isChecked && userFullName
  }

  const updateCodeOfConductStatus = (value) => {
    authStore.user?.profile?.setCodeOfConductSignedStatus(value)
    authStore.user?.profile.save()
  }
  const handleSubmit = async () => {
    if (!isValid()) {
      setErrorMessage("All fields must be entered")
      return
    }
    setErrorMessage(undefined)
    try {
      updateCodeOfConductStatus(true)
      navigation.navigate("home")
    } catch (err) {
      if (err.message) setErrorMessage(err.message)
    }
  }

  return (
    <View testID="codeOfConductScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="codeOfConductScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        {errorMessage && <Text preset="error" text={errorMessage} />}
        <View style={styles.box}>
          <ScrollView>
            <Text tx="codeOfConductScreen.paragraph1"></Text>
            <Break />
            <Text tx="codeOfConductScreen.paragraph2"></Text>
            <Break />
            <Text tx="codeOfConductScreen.paragraph3"></Text>
          </ScrollView>
        </View>
        <FlexContainer justifyCenter>
          <Checkbox style={styles.checkbox} value={isChecked} onToggle={setChecked} />
          <Text tx="codeOfConductScreen.acceptCodeOfConduct" />
        </FlexContainer>
        <Break />
        <FlexContainer style={styles.flexStyle}>
          <Text tx="codeOfConductScreen.signText" style={styles.signText}></Text>
          <TextField
            placeholderTx="codeOfConductScreen.placeHolder"
            autoCompleteType="name"
            onChangeText={setUserFullName}
            style={styles.textfield}
          />
        </FlexContainer>
        <SafeAreaView>
          <Button
            tx="codeOfConductScreen.submitButton"
            disabled={!isValid()}
            style={styles.submitButtonStyle}
            onPress={handleSubmit}
          />
        </SafeAreaView>
      </Screen>
    </View>
  )
})

const styles = StyleSheet.create({
  box: {
    backgroundColor: color.background,
    borderColor: color.primaryDarker,
    borderRadius: 4,
    borderWidth: 0.5,
    margin: 5,
    marginBottom: 20,
    padding: 10,
    height: "55%",
  },
  checkbox: {
    margin: 8,
  },
  flexStyle: {
    flexDirection: "column",
  },
  signText: {
    fontWeight: "bold",
  },
  submitButtonStyle: {
    marginTop: 40,
    width: "50%",
  },
  textfield: {
    height: 10,
  },
})
