import * as React from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

export interface LoadingProps {
  size?: number | "small" | "large"
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Describe your component here
 */
export const Loading = observer(function Loading(props: LoadingProps) {
  const { size = "small", style } = props

  return (
    <View style={style}>
      <ActivityIndicator size={size} />
    </View>
  )
})
