import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Header, Icon, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
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

const MenuListItem = styled.View`
  margin: ${spacing[3]}px auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`

const ICON_SIZE = {
  width: 30,
  height: 30,
  marginRight: spacing[3],
}

export const MenuScreen = observer(function MenuScreen() {
  // const { someStore, anotherStore } = useStores()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  return (
    <View testID="MenuScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="menuScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <Text preset={["header", "center", "bold"]} text="Mary Requester" />
        <Button preset="ghost" text="Edit profile" />
        <MenuList>
          <MenuListItem>
            <Icon icon="home" style={ICON_SIZE} />
            <Text preset={[]} tx="menuScreen.menuButtonRequesterInfo" />
          </MenuListItem>
          <MenuListItem>
            <Icon icon="home" style={ICON_SIZE} />
            <Text preset={[]} tx="menuScreen.menuButtonAboutUs" />
          </MenuListItem>
          <MenuListItem>
            <Icon icon="home" style={ICON_SIZE} />
            <Text preset={[]} tx="menuScreen.menuButtonUserAgreement" />
          </MenuListItem>
          <MenuListItem>
            <Icon icon="home" style={ICON_SIZE} />
            <Text preset={[]} tx="menuScreen.menuButtonResetPassword" />
          </MenuListItem>
          <MenuListItem>
            <Icon icon="home" style={ICON_SIZE} />
            <Text preset={[]} tx="menuScreen.menuButtonAskQuestion" />
          </MenuListItem>
          <MenuListItem>
            <Icon icon="home" style={ICON_SIZE} />
            <Text preset={[]} tx="menuScreen.menuButtonSignOut" />
          </MenuListItem>
        </MenuList>
      </Screen>
    </View>
  )
})
