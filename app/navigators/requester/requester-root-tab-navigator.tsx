import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MenuScreen, NotificationsScreen } from "../../screens"
import { NewRequestStackNavigator } from "./new-request-stack-navigator"
import { TabBarIcon } from "../../components"
import { color } from "../../theme"
import { RequesterHomeStackNavigator } from "./requester-home-stack-navigator"

export type RequesterTabNavigatorParamList = {
  demo: undefined
  demoList: undefined
  home: undefined
  signup: undefined
  chaperone: undefined
  roleSelect: undefined
  requester: undefined
  permissions: undefined
  welcome: undefined
  newRequest: undefined
  requestDetail: undefined
  notifications: undefined
  menu: undefined
}

const Tab = createBottomTabNavigator<RequesterTabNavigatorParamList>()

export function RequesterMainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBarOptions={{
        activeTintColor: color.palette.darkBlue,
      }}
      screenOptions={({ route }) => ({
        // tabBarIcon: () => <TabBarIcon icon="home" />,
      })}
    >
      <Tab.Screen
        name="home"
        component={RequesterHomeStackNavigator}
        options={{ tabBarLabel: "Home", tabBarIcon: () => <TabBarIcon icon="home" /> }}
      />
      <Tab.Screen
        name="newRequest"
        component={NewRequestStackNavigator}
        options={{ tabBarLabel: "Request", tabBarIcon: () => <TabBarIcon icon="request" /> }}
      />
      <Tab.Screen
        name="notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: () => <TabBarIcon icon="notification" />,
          tabBarBadge: 2,
        }}
      />
      <Tab.Screen
        name="menu"
        component={MenuScreen}
        options={{ tabBarLabel: "", tabBarIcon: () => <TabBarIcon icon="menu" /> }}
      />
    </Tab.Navigator>
  )
}
