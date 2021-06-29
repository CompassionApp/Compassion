import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { MenuScreen, NotificationsScreen } from "../../screens"
import { NewRequestStackNavigator } from "./new-request-stack-navigator"
import { color } from "../../theme"
import { RequesterHomeStackNavigator } from "./requester-home-stack-navigator"
import { useStores } from "../../models"
import { createTabIconForScreen } from "../tab-icon-utilities"
import { StackActions } from "@react-navigation/native"

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
  const { newRequestStore, notificationStore, requestStore } = useStores()

  useEffect(() => {
    requestStore.subscribeAsRequester()
    notificationStore.subscribe()

    return () => {
      requestStore.unsubscribeAll()
      notificationStore.unsubscribeAll()
    }
  }, [])

  /**
   * This function ensures we force the user to the beginning of the new request workflow if they
   * click on the tab button after sending a request.
   */
  const handleNewRequestOnFocus = (e, navigation) => {
    // Don't do anything if a request hasn't been completed yet
    if (!newRequestStore.isClean) {
      return
    }

    const defaultRoute = "new"
    const target = e.target
    const state = navigation.dangerouslyGetState()
    const route = state.routes.find((r) => r.key === target)
    // If we are leaving a tab that has its own stack navigation, then clear it
    if (
      route.state?.type === "stack" &&
      route.state.routes?.length > 1 &&
      route.state.routes[route.state.routes.length - 1].name !== defaultRoute
    ) {
      navigation.dispatch(StackActions.replace(defaultRoute))
    }
  }

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
        listeners={({ navigation }) => ({
          focus: (e) => handleNewRequestOnFocus(e, navigation),
        })}
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
