import { ViewStyle, TextStyle } from "react-native"
import { spacing, color, typography } from "."

export const FULL: ViewStyle = { flex: 1 }

export const BUTTON_STYLE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  marginVertical: spacing[2],
  backgroundColor: color.palette.darkBlue,
}
export const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
export const BOLD: TextStyle = { fontWeight: "bold" }
export const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
  color: color.palette.white,
}
