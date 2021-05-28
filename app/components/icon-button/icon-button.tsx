import * as React from "react"
import { TouchableOpacityProps, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Button, Text } from "../"
import { icons, IconTypes } from "../icon/icons"
import { Break } from "../break/break"
import styled from "styled-components/native"
import { TxKeyPath } from "../../i18n"

const BaseButton = styled(Button)`
  width: 220px;
  height: 220px;
  margin: 0 auto;
  border-radius: 20px;
`

const ButtonText = styled(Text)`
  padding: ${spacing[2]}px;
  color: ${color.palette.white};
  font-size: 18px;
`

const Icon = styled.Image``

const HUGE_BUTTON_STYLE: ViewStyle = {
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[2],
}

export interface IconButtonProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

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
 * Describe your component here
 */
export const IconButton = observer(function IconButton(props: IconButtonProps) {
  const { icon, text, tx, style: styleOverrides, ...rest } = props

  return (
    <BaseButton {...rest} style={{ ...HUGE_BUTTON_STYLE, ...styleOverrides }}>
      <Icon source={icons[icon]} />
      <Break size={3} />
      <ButtonText preset={["header", "bold"]} text={text} tx={tx} />
    </BaseButton>
  )
})
