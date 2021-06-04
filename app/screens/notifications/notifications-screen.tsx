import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { useNavigation } from "@react-navigation/native"
import { Header, Screen } from "../../components"
// import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { NotificationItem } from "./notification-item"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const NotificationsContainer = styled.View`
  background-color: ${color.palette.white};
  border-top-color: ${color.palette.grey3};
  border-top-width: 1px;
`

export const NotificationsScreen = observer(function NotificationsScreen() {
  // const { notificationsStore } = useStores()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  return (
    <View testID="NotificationsScreen" style={globalStyles.full}>
      <Screen style={ROOT} preset="scroll">
        <Header
          headerTx="notificationsScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <NotificationsContainer>
          <NotificationItem
            date="10/10/2021 3:42pm"
            title="You've been matched!"
            description="For GROCERY SHOPPING on 4/24."
          />
          <NotificationItem
            date="10/10/2021 3:42pm"
            title="You’ve completed your 4/16 trip"
            description="Please tell us how it went"
          />
          <NotificationItem
            date="10/10/2021 3:42pm"
            title="Your match on 4/22 has been canceled"
            description="The requester has canceled the request"
          />
        </NotificationsContainer>
      </Screen>
    </View>
  )
})
