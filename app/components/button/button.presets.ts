import { ViewStyle, TextStyle } from "react-native"
import { color, spacing, typography } from "../../theme"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  marginVertical: spacing[2],
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
}

const BASE_TEXT: TextStyle = {
  fontSize: 13,
  fontFamily: typography.primary,
  fontWeight: "bold",
  letterSpacing: 2,
  paddingHorizontal: spacing[3],
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets = {
  /**
   * A smaller piece of secondard information.
   */
  primary: { ...BASE_VIEW, backgroundColor: color.palette.darkBlue } as ViewStyle,

  /**
   * A button with an outline and no background color
   */
  ghost: {
    ...BASE_VIEW,
    backgroundColor: color.transparent,
    borderWidth: 1,
    borderColor: color.palette.darkBlue,
  } as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "flex-start",
  } as ViewStyle,
}

export const textPresets = {
  primary: {
    ...BASE_TEXT,
    color: color.palette.white,
    textTransform: "uppercase",
  } as TextStyle,
  ghost: {
    ...BASE_TEXT,
    color: color.palette.darkBlue,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  link: {
    ...BASE_TEXT,
    color: color.text,
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as TextStyle,
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets
