import React from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button, FlexContainer, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { format } from "date-fns"
import { DEFAULT_DATE_FORMAT } from "../../constants"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const UserAgreementScreen = observer(function UserAgreementScreen() {
  const { authStore } = useStores()
  const user = authStore.user

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const handlePressAccept = async () => {
    await user.acceptUserAgreement()
    navigateBack()
  }

  const acceptedOnDate = user
    ? format(new Date(user?.profile.acceptedUserAgreementAt), DEFAULT_DATE_FORMAT)
    : ""

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
            <FlexContainer justifyCenter>
              <Ionicons name="md-checkmark-circle" size={20} color={color.palette.green} />
              <FlexContainer marginLeft={`${spacing[2]}px`}>
                <Text preset="center" tx="userAgreementScreen.acceptedOn" />
                <Text preset="center" text={` ${acceptedOnDate}`} />
              </FlexContainer>
            </FlexContainer>
          )}
          <Button tx="userAgreementScreen.userAgreementAcceptButton" onPress={handlePressAccept} />
        </SafeAreaView>
      </Screen>
    </View>
  )
})
