import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles, typography } from "../../theme"
import { Card } from "./card"
import { useStores } from "../../models/root-store/root-store-context"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"
import { NoRequestsNotice } from "./no-requests-notice"

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

export const HomeScreen = observer(function HomeScreen() {
  const { requestStore } = useStores()
  const { requests } = requestStore
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const handlePressRequestDetail = (requestId: string) => () => {
    requestStore.selectCurrentRequest(requestId)
    navigation.navigate("requestDetail")
  }

  useEffect(() => {
    async function fetchData() {
      requestStore.getRequests()
    }

    fetchData()
  }, [])

  console.log("Home Screen rendering. Requests:", requests)

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
          <Title text=", John Doe" />
        </TitleView>
        <Screen preset="scroll">
          {requestStore.sortByCreated.length === 0 && (
            <>
              <Text preset={["bold", "center"]} tx="homeScreen.noneScheduledNoticeBold" />
              <NoRequestsNotice />
            </>
          )}
          {requestStore.sortByCreated.map((request) => (
            <Card
              key={request.id}
              // Nasty casting here
              status={request.status as RequestStatusEnum}
              type={request.type as RequestTypeEnum}
              requestId={request.id}
              requestedAt={request.requestedAt}
              onPress={handlePressRequestDetail(request.id)}
            />
          ))}
        </Screen>
      </Screen>
    </View>
  )
})
