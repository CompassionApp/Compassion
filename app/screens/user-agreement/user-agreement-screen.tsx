import React from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles } from "../../theme"
import { format } from "date-fns"
import { CALENDAR_DATE_FORMAT } from "../../constants"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const UserAgreementScreen = observer(function UserAgreementScreen() {
  const { authStore } = useStores()
  const { user } = authStore

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const handlePressAccept = async () => {
    await user.acceptUserAgreement()
    navigateBack()
  }

  const acceptedOnDate = format(
    new Date(user.profile.acceptedUserAgreementAt),
    CALENDAR_DATE_FORMAT,
  )

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
        <SafeAreaView>
          {user.profile.acceptedUserAgreementAt && (
            <>
              <Text preset="center" tx="userAgreementScreen.acceptedOn" />
              <Text preset="center" text={acceptedOnDate} />
            </>
          )}
          <Button tx="userAgreementScreen.userAgreementAcceptButton" onPress={handlePressAccept} />
        </SafeAreaView>
      </Screen>
    </View>
  )
})
