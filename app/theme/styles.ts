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

const BUTTON: ViewStyle = {
  backgroundColor: color.palette.darkBlue,
  marginVertical: spacing[2],
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
}

const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  color: color.palette.white,
  fontSize: 13,
  letterSpacing: 2,
}

const styles = {
  button: {
    ...BUTTON,
  } as ViewStyle,
  buttonText: {
    ...BUTTON_TEXT,
  } as TextStyle,
  buttonSecondary: {
    ...BUTTON,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: color.palette.darkBlue,
  } as ViewStyle,
  buttonSecondaryText: { ...BUTTON_TEXT, color: color.palette.darkBlue } as TextStyle,
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
