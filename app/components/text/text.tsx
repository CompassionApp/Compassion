import * as React from "react"
import { Text as ReactNativeText } from "react-native"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { translate } from "../../i18n"
import { mergeAll, flatten, ValueOfRecord } from "ramda"
import { parsePresets } from "./text.utils"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  // grab the props
  const { preset = "default", tx, txOptions, text, children, style: styleOverride, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const parsedPresets: ValueOfRecord<typeof presets>[] = parsePresets(preset)
  const style = mergeAll(flatten([presets.default, ...parsedPresets, styleOverride]))

  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  )
}
