import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { MenuScreen, NotificationsScreen } from "../../screens"
import { TabBarIcon } from "../../components"
import { color } from "../../theme"
import { ChaperoneHomeStackNavigator } from "./chaperone-home-stack-navigator"
import { useStores } from "../../models"

export type ChaperoneTabNavigatorParamList = {
  home: undefined
  chaperone: undefined
  requestDetail: undefined
  notifications: undefined
  schedule: undefined
  menu: undefined
}

const Tab = createBottomTabNavigator<ChaperoneTabNavigatorParamList>()

export const ChaperoneMainTabNavigator = observer(function ChaperoneMainTabNavigator() {
  const { requestStore, notificationStore } = useStores()

  useEffect(() => {
    requestStore.subscribeAsChaperone()
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
      screenOptions={() => ({
        // tabBarIcon: () => <TabBarIcon icon="home" />,
      })}
    >
      <Tab.Screen
        name="home"
        component={ChaperoneHomeStackNavigator}
        options={{ tabBarLabel: "Home", tabBarIcon: () => <TabBarIcon icon="home" /> }}
      />
      {/* <Tab.Screen
        name="schedule"
        component={ChaperoneScheduleScreen}
        options={{ tabBarLabel: "Schedule", tabBarIcon: () => <TabBarIcon icon="home" /> }}
      /> */}
      <Tab.Screen
        name="notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: () => <TabBarIcon icon="notification" />,
          tabBarBadge:
            notificationStore.notificationCount !== 0
              ? notificationStore.notificationCount
              : undefined,
        }}
      />
      <Tab.Screen
        name="menu"
        component={MenuScreen}
        options={{ tabBarLabel: "", tabBarIcon: () => <TabBarIcon icon="menu" /> }}
      />
    </Tab.Navigator>
  )
})
