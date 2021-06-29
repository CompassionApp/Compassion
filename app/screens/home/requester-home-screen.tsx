import React from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView, View, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { Break, Button, FlexContainer, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles, typography } from "../../theme"
import { RequestCard } from "./request-card"
import { useStores } from "../../models/root-store/root-store-context"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import { NoRequestsNotice } from "./no-requests-notice"
import { NotificationModel, ChaperoneRequestSnapshot } from "../../models"
import { createNewRequestNotification } from "../../utils/notification-factory"

const DEBUG = false
const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const Title = styled(Text)`
  font-family: ${typography.secondary};
  font-size: 24px;
`

export const RequesterHomeScreen = observer(function RequesterHomeScreen() {
  const { authStore, requestStore, notificationStore } = useStores()
  const profile = authStore.user?.profile
  const navigation = useNavigation()

  const [refreshing, setRefreshing] = React.useState(false)

  const handlePressRequestDetail = (requestId: string) => () => {
    requestStore.selectCurrentRequest(requestId)
    navigation.navigate("requestDetail")
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    requestStore.getRequests().then(() => setRefreshing(false))
  }, [])

  const handlePressNotify = () => {
    const notification = NotificationModel.create(
      createNewRequestNotification(authStore.user.profile, ({
        id: "request-test-id",
        requestedAt: new Date().toUTCString(),
      } as unknown) as ChaperoneRequestSnapshot),
    )
    notificationStore.notifyChaperonesNewRequest(notification)
  }

  return (
    <View testID="HomeScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header headerTx="homeScreen.title" style={globalStyles.header} />
        <FlexContainer justifyCenter>
          <Title tx="homeScreen.welcome" />
          <Title text={`, ${profile?.firstName ?? "Unknown"}`} />
        </FlexContainer>
        <Break />
        {DEBUG && <Button text="Notify chaperones" onPress={handlePressNotify} />}
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text preset={["center", "bold"]} text="Your pending requests" />

          {requestStore.sortUserRequestsByCreated.length === 0 && (
            <>
              <Text preset={["bold", "center"]} tx="homeScreen.noneScheduledNoticeBold" />
              <NoRequestsNotice />
            </>
          )}
          {requestStore.sortUserRequestsByCreated.map((request: ChaperoneRequestSnapshot) => (
            <RequestCard
              key={request.id}
              status={request.status as RequestStatusEnum}
              type={request.type as RequestTypeEnum}
              requestId={request.id}
              requestedAt={request.requestedAt}
              onPress={handlePressRequestDetail(request.id)}
            />
          ))}
        </ScrollView>
      </Screen>
    </View>
  )
})
