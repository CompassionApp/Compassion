import { useNavigation } from "@react-navigation/native"
import format from "date-fns/format"
import React from "react"
import styled from "styled-components/native"
import { Text } from "../../components"
import { FULL_TIME_FORMAT } from "../../constants"
import { NotificationSnapshot, useStores } from "../../models"
import { color, spacing, typography } from "../../theme"

const Container = styled.TouchableOpacity`
  background-color: ${color.palette.white};
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
  notification: NotificationSnapshot
  onPress?: () => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const navigation = useNavigation()
  const { requestStore } = useStores()
  const formattedDate = format(new Date(notification.data.sentAt), FULL_TIME_FORMAT)

  const handlePress = () => {
    requestStore.selectCurrentRequest(notification.data.requestId)
    navigation.navigate("requestDetail")
    onPress && onPress()
  }

  return (
    <Container onPress={handlePress}>
      <NotificationDate text={formattedDate} />
      <NotificationTitle text={notification.title} />
      <Text text={notification.body} />
    </Container>
  )
}
