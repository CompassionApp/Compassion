import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { MenuScreen, NotificationsScreen } from "../../screens"
import { NewRequestStackNavigator } from "./new-request-stack-navigator"
import { color } from "../../theme"
import { RequesterHomeStackNavigator } from "./requester-home-stack-navigator"
import { useStores } from "../../models"

const ICON_SIZE = 28
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
      screenOptions={({ route }) => ({
        // tabBarIcon: ({ color }) => <TabBarIcon icon="home" />,
      })}
    >
      <Tab.Screen
        name="home"
        component={RequesterHomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-home-sharp" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="newRequest"
        component={NewRequestStackNavigator}
        options={{
          tabBarLabel: "Request",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="alarm-add" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="notification-important" size={ICON_SIZE} color={color} />
          ),
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
          tabBarIcon: ({ color }) => <Ionicons name="menu" size={ICON_SIZE + 6} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
})
