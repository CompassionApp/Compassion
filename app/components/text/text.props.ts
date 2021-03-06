import { TextStyle, TextProps as TextProperties } from "react-native"
import { TextPresets } from "./text.presets"
import { TxKeyPath } from "../../i18n"

export interface TextProps extends TextProperties {
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath

  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: I18n.TranslateOptions

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: TextStyle | TextStyle[]

  /**
   * One of the different types of text presets.
   */
  preset?: TextPresets | TextPresets[]
}
