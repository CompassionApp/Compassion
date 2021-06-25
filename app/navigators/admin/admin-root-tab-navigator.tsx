import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { MenuScreen } from "../../screens"
import { color } from "../../theme"
import { AdminHomeStackNavigator, AdminUsersStackNavigator } from ".."
import { createTabIconForScreen } from "../tab-icon-utilities"
import { useStores } from "../../models"

export type AdminTabNavigatorParamList = {
  home: undefined
  requestDetail: undefined
  users: undefined
  menu: undefined
}

const Tab = createBottomTabNavigator<AdminTabNavigatorParamList>()

export const AdminRootTabNavigator = observer(function AdminRootTabNavigator() {
  const { requestStore } = useStores()

  useEffect(() => {
    requestStore.subscribeAsAdmin()

    return () => {
      requestStore.unsubscribeAll()
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
        component={AdminHomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: createTabIconForScreen("home"),
        }}
      />

      <Tab.Screen
        name="users"
        component={AdminUsersStackNavigator}
        options={{
          tabBarLabel: "Users",
          tabBarIcon: createTabIconForScreen("users"),
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
