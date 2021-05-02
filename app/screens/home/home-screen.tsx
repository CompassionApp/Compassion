import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, globalStyles, typography } from "../../theme"
import { Card } from "./card"

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
  font-size: 24;
`

export const HomeScreen = observer(function HomeScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
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
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </Screen>
      </Screen>
    </View>
  )
})
