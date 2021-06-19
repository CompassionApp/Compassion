import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Break, Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import styled from "styled-components/native"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const MenuList = styled.View`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
`

const MenuListItem = styled.TouchableOpacity<{ disabled?: boolean }>`
  margin: ${spacing[4]}px auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 150px;
  ${({ disabled }) => !!disabled === true && "opacity: 0.2;"}
`

// const ICON_SIZE = {
//   width: 30,
//   height: 30,
//   marginRight: spacing[4],
// }

export const MenuScreen = observer(function MenuScreen() {
  const { authStore } = useStores()

  const profile = authStore.user?.profile
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateLogin = () => navigation.navigate("welcome")

  const handlePressSignOut = async () => {
    await authStore.signOut()
    navigateLogin()
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
        <MenuList>
          <MenuListItem disabled>
            {/* <Icon icon="home" style={ICON_SIZE} /> */}
            <Text
              preset={[]}
              tx={
                authStore?.user?.isChaperoneRole
                  ? "menuScreen.menuButtonChaperoneInfo"
                  : "menuScreen.menuButtonRequesterInfo"
              }
            />
          </MenuListItem>
          <MenuListItem disabled>
            {/* <Icon icon="home" style={ICON_SIZE} /> */}
            <Text preset={[]} tx="menuScreen.menuButtonAboutUs" />
          </MenuListItem>
          <MenuListItem onPress={() => navigation.navigate("userAgreement")}>
            {/* <Icon icon="home" style={ICON_SIZE} /> */}
            <Text preset={[]} tx="menuScreen.menuButtonUserAgreement" />
          </MenuListItem>
          <MenuListItem disabled>
            {/* <Icon icon="home" style={ICON_SIZE} /> */}
            <Text preset={[]} tx="menuScreen.menuButtonResetPassword" />
          </MenuListItem>
          <MenuListItem disabled>
            {/* <Icon icon="home" style={ICON_SIZE} /> */}
            <Text preset={[]} tx="menuScreen.menuButtonAskQuestion" />
          </MenuListItem>
          <MenuListItem onPress={handlePressSignOut}>
            {/* <Icon icon="home" style={ICON_SIZE} /> */}
            <Text preset={[]} tx="menuScreen.menuButtonSignOut" />
          </MenuListItem>
        </MenuList>
      </Screen>
    </View>
  )
})
