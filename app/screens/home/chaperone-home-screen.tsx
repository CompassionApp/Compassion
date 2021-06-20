import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView, View, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { Break, FlexContainer, FlexItem, Header, Screen, Switch, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles, spacing, typography } from "../../theme"
import { RequestCard } from "./request-card"
import { useStores } from "../../models/root-store/root-store-context"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import { RequestSnapshot } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const Title = styled(Text)`
  font-family: ${typography.secondary};
  font-size: 24px;
`

const AcceptDescription = styled.View`
  padding: 0 ${spacing[2]}px;
`

export const ChaperoneHomeScreen = observer(function HomeScreen() {
  const { authStore, requestStore } = useStores()
  const navigation = useNavigation()
  const [enableNotifications, setEnableNotifications] = useState<boolean>(
    authStore.user?.profile?.enableNotifications ?? false,
  )
  const [refreshing, setRefreshing] = React.useState(false)

  const profile = authStore?.user?.profile

  const handlePressRequestDetail = (requestId: string) => () => {
    requestStore.selectCurrentRequest(requestId)
    navigation.navigate("requestDetail")
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    Promise.all([requestStore.getRequests(), requestStore.getAvailableRequests()]).then(() =>
      setRefreshing(false),
    )
  }, [])

  const handleChangeRequestNotify = (value) => {
    setEnableNotifications(value)
    authStore.user?.profile.setEnableNotifications(value)
    authStore.user?.profile.save()
  }

  return (
    <View testID="HomeScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header headerTx="homeScreen.title" style={globalStyles.header} />
        <FlexContainer justifyCenter>
          <Title tx="homeScreen.welcome" />
          <Title text={`, ${profile?.firstName ?? "Unknown"} ${profile?.lastName ?? ""}`} />
        </FlexContainer>
        <Break />
        <FlexContainer justifyCenter width="100%">
          <FlexContainer justifyCenter column>
            <Text preset={["center", "bold"]} tx="chaperoneHomeScreen.acceptRequests" />
            <Break />
            <FlexContainer justifyCenter width="260px">
              <AcceptDescription>
                <Text tx="chaperoneHomeScreen.acceptRequestsDescription" />
              </AcceptDescription>
              <FlexItem basis="10px"></FlexItem>
              <Switch value={enableNotifications} onToggle={handleChangeRequestNotify} />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
        <Break />
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text preset={["center", "bold"]} tx="chaperoneHomeScreen.yourScheduledRequests" />
          <Break />
          {requestStore.requests.length === 0 && (
            <>
              <Text preset={["center"]} tx="chaperoneHomeScreen.noScheduledRequests" />
            </>
          )}
          {requestStore.requests.map((request: RequestSnapshot) => (
            <RequestCard
              key={request.id}
              status={request.status as RequestStatusEnum}
              type={request.type as RequestTypeEnum}
              requestId={request.id}
              requestedAt={request.requestedAt}
              onPress={handlePressRequestDetail(request.id)}
            />
          ))}
          <Break />
          <Break />
          <Text preset={["center", "bold"]} tx="chaperoneHomeScreen.availableRequests" />
          <Break />
          {requestStore.availableRequests.length === 0 && (
            <>
              <Text preset={["center"]} tx="chaperoneHomeScreen.noOpenRequests" />
            </>
          )}
          {requestStore.sortAvailableRequestsByCreated.map((request: RequestSnapshot) => (
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
