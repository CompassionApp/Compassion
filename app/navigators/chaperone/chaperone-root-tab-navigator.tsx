import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MenuScreen, NotificationsScreen } from "../../screens"
import { TabBarIcon } from "../../components"
import { color } from "../../theme"
import { ChaperoneHomeStackNavigator } from "./chaperone-home-stack-navigator"
import { ChaperoneScheduleScreen } from "../../screens/chaperone-schedule/chaperone-schedule-screen"

export type ChaperoneTabNavigatorParamList = {
  home: undefined
  chaperone: undefined
  requestDetail: undefined
  notifications: undefined
  schedule: undefined
  menu: undefined
}

const Tab = createBottomTabNavigator<ChaperoneTabNavigatorParamList>()

export function ChaperoneMainTabNavigator() {
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
        component={ChaperoneHomeStackNavigator}
        options={{ tabBarLabel: "Home", tabBarIcon: () => <TabBarIcon icon="home" /> }}
      />
      <Tab.Screen
        name="schedule"
        component={ChaperoneScheduleScreen}
        options={{ tabBarLabel: "Schedule", tabBarIcon: () => <TabBarIcon icon="home" /> }}
      />
      <Tab.Screen
        name="notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: () => <TabBarIcon icon="notification" />,
          tabBarBadge: 3,
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
