import * as React from "react"
import { ImageStyle } from "react-native"
import { Icon } from "../"
import { IconTypes } from "../icon/icons"

const ICON_STYLE: ImageStyle = {
  width: 23,
  height: 23,
}

export interface TabBarIconProps {
  icon: IconTypes
}

/**
 * For use in react-navigation's Tab.Screen
 */
export const TabBarIcon: React.FC<TabBarIconProps> = ({ icon }) => (
  <Icon icon={icon} style={ICON_STYLE} />
)
TabBarIcon.displayName = "TabBarIcon"
