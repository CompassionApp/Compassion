import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { MenuScreen, NotificationsScreen } from "../../screens"
import { NewRequestStackNavigator } from "./new-request-stack-navigator"
import { color } from "../../theme"
import { RequesterHomeStackNavigator } from "./requester-home-stack-navigator"
import { useStores } from "../../models"
import { createTabIconForScreen } from "../tab-icon-utilities"

export type RequesterTabNavigatorParamList = {
  home: undefined
  permissions: undefined
  welcome: undefined
  newRequest: undefined
  requestDetail: undefined
  notifications: undefined
  menu: undefined
}

const Tab = createBottomTabNavigator<RequesterTabNavigatorParamList>()

export const RequesterMainTabNavigator = observer(function RequesterMainTabNavigator() {
  const { notificationStore, requestStore } = useStores()

  useEffect(() => {
    requestStore.subscribeAsRequester()
    notificationStore.subscribe()

    return () => {
      requestStore.unsubscribeAll()
      notificationStore.unsubscribeAll()
    }
  }, [])

  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBarOptions={{
        activeTintColor: color.palette.darkBlue,
      }}
    >
      <Tab.Screen
        name="home"
        component={RequesterHomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: createTabIconForScreen("home"),
        }}
      />
      <Tab.Screen
        name="newRequest"
        component={NewRequestStackNavigator}
        options={{
          tabBarLabel: "Request",
          tabBarIcon: createTabIconForScreen("newRequest"),
        }}
      />
      <Tab.Screen
        name="notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: createTabIconForScreen("notifications"),
          tabBarBadge:
            notificationStore.notificationCount !== 0
              ? notificationStore.notificationCount
              : undefined,
        }}
      />
      <Tab.Screen
        name="menu"
        component={MenuScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: createTabIconForScreen("menu"),
        }}
      />
    </Tab.Navigator>
  )
})
