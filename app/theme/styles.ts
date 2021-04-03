import { StyleSheet, ViewStyle } from "react-native"
import { color } from "./color"
import { spacing } from "./spacing"

/**
 * Contains default global styles we can apply to components
 */

const styles = {
  full: {
    flex: 1,
  } as ViewStyle,
  header: {
    backgroundColor: color.background,
    paddingBottom: spacing[4] + spacing[1],
    paddingHorizontal: 0,
    paddingTop: spacing[3],
  } as ViewStyle,
  root: { backgroundColor: color.background, paddingHorizontal: spacing[4] } as ViewStyle,
}

export const globalStyles = StyleSheet.create(styles)
