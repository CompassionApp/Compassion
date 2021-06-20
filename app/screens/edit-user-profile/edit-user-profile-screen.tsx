import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { Break, Button, FlexContainer, Header, Screen, Text, TextField } from "../../components"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const EditUserProfileScreen = observer(function EditUserProfileScreen() {
  const { authStore } = useStores()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const [firstName, setFirstName] = useState<string>(authStore.user?.profile?.firstName)
  const [lastName, setLastName] = useState<string>(authStore.user?.profile?.lastName)
  const [phoneNumber, setPhoneNumber] = useState<string>(authStore.user?.profile?.phoneNumber)
  const [saved, setSaved] = useState<boolean>(false)

  const handleChangeFirstName = (text) => {
    setFirstName(text)
    setSaved(false)
  }
  const handleChangeLastName = (text) => {
    setLastName(text)
    setSaved(false)
  }
  const handleChangePhoneNumber = (text) => {
    setPhoneNumber(text)
    setSaved(false)
  }
  const handlePressSave = async () => {
    try {
      authStore.user.profile.setFirstName(firstName)
      authStore.user.profile.setLastName(lastName)
      authStore.user.profile.setPhoneNumber(phoneNumber)
      await authStore.user.save()
      setSaved(true)
    } catch (e) {
      console.log("Error:", e)
    }
  }

  return (
    <View testID="EditUserProfileScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="editUserProfileScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <TextField
          labelTx="editUserProfileScreen.firstNameLabel"
          defaultValue={firstName}
          autoCompleteType="name"
          onChangeText={handleChangeFirstName}
        />
        <TextField
          labelTx="editUserProfileScreen.lastNameLabel"
          defaultValue={lastName}
          onChangeText={handleChangeLastName}
        />
        <TextField
          labelTx="editUserProfileScreen.phoneNumberLabel"
          placeholderTx="editUserProfileScreen.phoneNumberPlaceholder"
          value={phoneNumber}
          defaultValue={phoneNumber}
          onChangeText={handleChangePhoneNumber}
          autoCompleteType="tel"
          keyboardType="phone-pad"
          maxLength={12}
        />
        <Break />
        {saved && (
          <FlexContainer justifyCenter>
            <Ionicons name="md-checkmark-circle" size={20} color={color.palette.green} />
            <FlexContainer marginLeft={`${spacing[2]}px`}>
              <Text preset={["center"]} tx="editUserProfileScreen.savedNotice" />
            </FlexContainer>
          </FlexContainer>
        )}
        <Button tx="editUserProfileScreen.saveButton" onPress={handlePressSave} />
      </Screen>
    </View>
  )
})
