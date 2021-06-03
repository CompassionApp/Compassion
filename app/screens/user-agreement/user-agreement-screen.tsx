import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const UserAgreementScreen = observer(function UserAgreementScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  return (
    <View testID="UserAgreementScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="userAgreementScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <Screen preset="scroll">
          <Text tx="userAgreementScreen.userAgreement"></Text>
        </Screen>
        <Button tx="userAgreementScreen.userAgreementAcceptButton" onPress={navigateBack} />
      </Screen>
    </View>
  )
})
