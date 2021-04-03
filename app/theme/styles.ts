import { StyleSheet, TextStyle, ViewStyle } from "react-native"
import { spacing, color, typography } from "./index"

/**
 * Contains default global styles we can apply to components
 */

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}

const BOLD: TextStyle = { fontWeight: "bold" }

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
  headerTitle: {
    ...TEXT,
    ...BOLD,
    fontSize: 12,
    letterSpacing: 1.5,
    lineHeight: 15,
    textAlign: "center",
  } as TextStyle,
  title: {
    ...TEXT,
    ...BOLD,
    fontSize: 28,
    lineHeight: 38,
    textAlign: "center",
  } as TextStyle,
  root: { backgroundColor: color.background, paddingHorizontal: spacing[4] } as ViewStyle,
}

export const globalStyles = StyleSheet.create(styles)
