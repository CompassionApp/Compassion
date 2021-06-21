import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { SectionList, SectionListData, View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"
import { Button, FlexContainer, Header, Screen, Text } from "../../components"
import { NotificationSnapshot, NotificationTypeEnum, useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { NotificationItem } from "./notification-item"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const ActionContainer = styled(FlexContainer)`
  padding-horizontal: ${spacing[2]}px;
  padding-vertical: ${spacing[2]}px;
`

export const SAMPLE_NOTIFICATIONS: NotificationSnapshot[] = [
  {
    id: "test1",
    title: "You've been matched!",
    body: "For GROCERY SHOPPING on 4/24.",
    subtitle: null,
    type: NotificationTypeEnum.REQUEST_MATCHED,
    data: null,
  },
  {
    id: "test2",
    title: "You’ve completed your 4/16 trip",
    body: "Please tell us how it went",
    type: NotificationTypeEnum.REQUEST_REMINDER,
    subtitle: null,
    data: null,
  },
  {
    id: "test3",
    title: "Your match on 4/22 has been canceled",
    body: "The requester has canceled the request",
    type: NotificationTypeEnum.REQUEST_REMINDER,
    subtitle: null,
    data: null,
  },
]

export const NotificationsScreen = observer(function NotificationsScreen() {
  const { notificationStore } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    notificationStore.fetch().then(() => setRefreshing(false))
  }, [])

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handlePressClearAll = () => {
    notificationStore.clearAll()
  }

  useEffect(() => {
    notificationStore.fetch()
  }, [])

  const sectionListData: SectionListData<NotificationSnapshot>[] = [
    { title: "", data: notificationStore.notifications },
    // { title: "", data: SAMPLE_NOTIFICATIONS },
  ]

  return (
    <View testID="NotificationsScreen" style={globalStyles.full}>
      <Screen style={ROOT} preset="fixed">
        <Header
          headerTx="notificationsScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <SectionList<NotificationSnapshot>
          sections={sectionListData}
          keyExtractor={(notification) => notification.id}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
        <ActionContainer justifyCenter width="100%">
          <Button
            tx="notificationsScreen.clearAllNotificationsButton"
            onPress={handlePressClearAll}
            disabled={notificationStore.notificationCount === 0}
          />
        </ActionContainer>
      </Screen>
    </View>
  )
})
