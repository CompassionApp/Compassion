import React from "react"
import { TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native"
import { color, spacing, typography } from "../../theme"
import { translate, TxKeyPath } from "../../i18n"
import { Text } from "../text/text"
import { mergeAll, flatten } from "ramda"

// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3],
}

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  minHeight: 44,
  fontSize: 16,
  backgroundColor: color.transparent,
  borderColor: color.palette.black,
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
  paddingTop: spacing[4],
}

const OFFSET_LABEL: ViewStyle = {
  position: "absolute",
  top: 4,
  left: 15,
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

export interface TextFieldProps extends TextInputProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * The label i18n key.
   */
  labelTx?: TxKeyPath

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: TextStyle | TextStyle[]

  /**
   * Various look & feels.
   */
  preset?: keyof typeof PRESETS

  forwardedRef?: any
}

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]))
}

/**
 * A component which has a label and an input together.
 */
export function TextField(props: TextFieldProps) {
  const {
    placeholderTx,
    placeholder,
    labelTx,
    label,
    preset = "default",
    style: styleOverride,
    inputStyle: inputStyleOverride,
    forwardedRef,
    ...rest
  } = props
  let containerStyle: ViewStyle = { ...CONTAINER, ...PRESETS[preset] }
  containerStyle = enhance(containerStyle, styleOverride)

  let inputStyle: TextStyle = INPUT
  inputStyle = enhance(inputStyle, inputStyleOverride)
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.grey3}
        underlineColorAndroid={color.transparent}
        {...rest}
        style={inputStyle}
        ref={forwardedRef}
      />
      {(labelTx || label) && (
        <View style={OFFSET_LABEL}>
          <Text preset="fieldLabel" tx={labelTx} text={label} />
        </View>
      )}
    </View>
  )
}
