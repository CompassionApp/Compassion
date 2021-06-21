import * as React from "react"
import { TouchableOpacityProps, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { MaterialIcons } from "@expo/vector-icons"
import { color, spacing } from "../../theme"
import { Button, Text } from "../"
import { Break } from "../break/break"
import styled from "styled-components/native"
import { TxKeyPath } from "../../i18n"

const BaseButton = styled(Button)`
  width: 190px;
  height: 190px;
  margin: 0 auto;
  border-radius: 20px;
`

const ButtonText = styled(Text)`
  padding: ${spacing[2]}px;
  color: ${color.palette.white};
  font-size: 18px;
`

const HUGE_BUTTON_STYLE: ViewStyle = {
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[2],
}

export interface IconButtonProps extends TouchableOpacityProps {
  /**
   * Icon name
   */
  name: keyof typeof MaterialIcons.glyphMap

  /**
   * Color
   */
  color?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath

  /**
   * Style overrides
   */
  style?: ViewStyle
}

/**
 * Button with an icon
 */
export const IconButton = observer(function IconButton(props: IconButtonProps) {
  const { name, color, text, tx, style: styleOverrides, ...rest } = props

  return (
    <BaseButton {...rest} style={{ ...HUGE_BUTTON_STYLE, ...styleOverrides }}>
      <MaterialIcons name={name} color={color} size={120} />
      <Break size={1} />
      <ButtonText preset={["header", "bold"]} text={text} tx={tx} />
    </BaseButton>
  )
})
