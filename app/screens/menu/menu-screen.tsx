import React from "react"
import { observer } from "mobx-react-lite"
import { Alert, View, ViewStyle } from "react-native"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"
import { Break, Button, FlexContainer, Header, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const MenuList = styled(FlexContainer)``

const MenuListItem = styled.TouchableOpacity<{ disabled?: boolean }>`
  margin: ${spacing[4]}px auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 180px;
  ${({ disabled }) => !!disabled === true && "opacity: 0.2;"}
`

const MenuItemText = styled(Text)`
  margin-left: ${spacing[5]}px;
  font-size: ${spacing[4]}px;
`
const ICON_SIZE = 30

export const MenuScreen = observer(function MenuScreen() {
  const { authStore } = useStores()

  const profile = authStore.user?.profile
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handlePressSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you would like to log out of your account?", [
      { text: "Yes", onPress: () => authStore.signOut() },
      {
        text: "No",
        style: "cancel",
      },
    ])
  }

  return (
    <View testID="MenuScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="menuScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <Text
          preset={["header", "center", "bold"]}
          text={`${profile?.firstName ?? "Unknown"} ${profile?.lastName ?? ""}`}
        />
        <Break />
        <Button
          preset="ghost"
          text="Edit profile"
          onPress={() => navigation.navigate("editUserProfile")}
        />
        <MenuList column justifyStart>
          <MenuListItem disabled>
            <FontAwesome name="user-circle" size={ICON_SIZE} color={color.palette.blue} />
            <MenuItemText
              preset={[]}
              tx={
                authStore?.user?.profile?.isChaperone
                  ? "menuScreen.menuButtonChaperoneInfo"
                  : "menuScreen.menuButtonRequesterInfo"
              }
            />
          </MenuListItem>
          <MenuListItem disabled>
            <MaterialIcons name="location-city" size={ICON_SIZE} color={color.palette.blue} />
            <MenuItemText preset={[]} tx="menuScreen.menuButtonAboutUs" />
          </MenuListItem>
          <MenuListItem onPress={() => navigation.navigate("userAgreement")}>
            <MaterialIcons name="menu-book" size={ICON_SIZE} color={color.palette.blue} />
            <MenuItemText preset={[]} tx="menuScreen.menuButtonUserAgreement" />
          </MenuListItem>
          <MenuListItem onPress={() => navigation.navigate("resetPassword")}>
            <MaterialIcons name="vpn-key" size={ICON_SIZE} color={color.palette.blue} />
            <MenuItemText preset={[]} tx="menuScreen.menuButtonResetPassword" />
          </MenuListItem>
          <MenuListItem disabled>
            <MaterialIcons name="question-answer" size={ICON_SIZE} color={color.palette.blue} />
            <MenuItemText preset={[]} tx="menuScreen.menuButtonAskQuestion" />
          </MenuListItem>
          <MenuListItem onPress={handlePressSignOut}>
            <Ionicons name="md-log-out-outline" size={ICON_SIZE} color={color.palette.blue} />
            <MenuItemText preset={[]} tx="menuScreen.menuButtonSignOut" />
          </MenuListItem>
        </MenuList>
      </Screen>
    </View>
  )
})
