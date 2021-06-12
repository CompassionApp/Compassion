import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView, View, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { Break, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles, typography } from "../../theme"
import { RequestCard } from "./request-card"
import { useStores } from "../../models/root-store/root-store-context"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import { RequestSnapshot } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const TitleView = styled.View`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`
const Title = styled(Text)`
  font-family: ${typography.secondary};
  font-size: 24px;
`

export const ChaperoneHomeScreen = observer(function HomeScreen() {
  const { authStore, requestStore } = useStores()
  const profile = authStore.user?.profile
  const navigation = useNavigation()

  const [refreshing, setRefreshing] = React.useState(false)

  const navigateBack = () => navigation.goBack()
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

  useEffect(() => {
    requestStore.subscribeAsChaperone()

    return () => {
      requestStore.unsubscribeAll()
    }
  }, [])

  return (
    <View testID="HomeScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="homeScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <TitleView>
          <Title tx="homeScreen.welcome" />
          <Title text={`, ${profile?.firstName ?? "Unknown"} ${profile?.lastName ?? ""}`} />
        </TitleView>
        <Break />
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text preset={["center", "bold"]} text="Available Requests" />
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
          <Break />
          <Break />
          <Text preset={["center", "bold"]} text="Your Scheduled Requests" />
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
        </ScrollView>
      </Screen>
    </View>
  )
})
