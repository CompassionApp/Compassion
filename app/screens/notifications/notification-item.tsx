import React from "react"
import styled from "styled-components/native"
import { Text } from "../../components"
import { color, spacing, typography } from "../../theme"

const Container = styled.TouchableOpacity`
  border-bottom-color: ${color.palette.grey3};
  border-bottom-width: 1px;
  padding: ${spacing[4]}px ${spacing[4]}px;
`

const NotificationDate = styled(Text)`
  font-size: 12px;
  font-family: ${typography.secondary};
  margin-bottom: ${spacing[3]}px;
`

const NotificationTitle = styled(Text)`
  font-size: 20px;
  font-family: ${typography.secondary};
  margin-bottom: ${spacing[1]}px;
`

interface NotificationItemProps {
  date: string
  title: string
  description?: string
  onPress?: () => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  date,
  title,
  description,
  onPress,
}) => (
  <Container onPress={onPress}>
    <NotificationDate text={date} />
    <NotificationTitle text={title} />
    <Text text={description} />
  </Container>
)
