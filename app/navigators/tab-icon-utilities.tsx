import React from "react"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { ChaperoneTabNavigatorParamList, RequesterTabNavigatorParamList } from "."
import { AdminTabNavigatorParamList } from "./admin/admin-root-tab-navigator"

const ICON_SIZE = 28

type IconLibrary = "Ionicons" | "MaterialIcons"
// All possible icon names
type IconNames = keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap
// All possible screen names for tabs
type TabScreenNames =
  | keyof RequesterTabNavigatorParamList
  | keyof ChaperoneTabNavigatorParamList
  | keyof AdminTabNavigatorParamList

const mapScreenToIcon = new Map<TabScreenNames, [IconLibrary, IconNames]>([
  ["home", ["Ionicons", "md-home-sharp"]],
  ["newRequest", ["MaterialIcons", "alarm-add"]],
  ["notifications", ["MaterialIcons", "notification-important"]],
  ["menu", ["Ionicons", "menu"]],
  ["schedule", ["Ionicons", "md-calendar-outline"]],
  ["users", ["Ionicons", "people"]],
])

/**
 * Produces a TabBarIcon component that will render the correct tab icon for any given screen in the
 * map
 *
 * @param screen Screen to produce an icon for
 */
export const createTabIconForScreen = (screen: TabScreenNames) =>
  function TabBarIcon({
    color,
    size,
  }: {
    color: string
    focused: boolean
    size: number
  }): React.ReactNode {
    if (!mapScreenToIcon.has(screen)) {
      throw new Error(`Screen ${screen} is not in mapScreenToIcon`)
    }
    const [library, name] = mapScreenToIcon.get(screen)

    let Component

    switch (library) {
      case "Ionicons":
        Component = Ionicons
        break
      case "MaterialIcons":
        Component = MaterialIcons
        break
    }

    return <Component name={name} size={size || ICON_SIZE} color={color} />
  }
