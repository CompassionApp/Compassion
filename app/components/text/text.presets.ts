import { TextStyle } from "react-native"
import { color, typography } from "../../theme"

/**
 * All text will start off looking like this.
 */
const BASE: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  fontSize: 15,
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const presets = {
  /**
   * The default text styles.
   */
  default: BASE,

  /**
   * A bold version of the default text.
   */
  bold: { fontWeight: "bold", fontFamily: typography.tertiary } as TextStyle,

  /**
   * Large headers.
   */
  header: { fontSize: 24, fontWeight: "bold" } as TextStyle,

  /**
   * Small all-caps headers
   */
  smallHeader: {
    fontSize: 15,
    fontFamily: typography.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.1,
  } as TextStyle,

  /**
   * Centered
   */
  center: { textAlign: "center" } as TextStyle,

  /**
   * Error text
   */
  error: {
    color: color.error,
    textAlign: "center",
    fontSize: 14,
  } as TextStyle,

  /**
   * Field labels that appear on forms above the inputs.
   */
  fieldLabel: {
    fontFamily: typography.secondary,
    fontSize: 14,
    color: color.palette.black,
    backgroundColor: color.background,
    paddingHorizontal: 4,
    textTransform: "uppercase",
  } as TextStyle,

  /**
   * A smaller piece of secondary information.
   */
  secondary: { fontSize: 9, color: color.dim } as TextStyle,
}

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets
