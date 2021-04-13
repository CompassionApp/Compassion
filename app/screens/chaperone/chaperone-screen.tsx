import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Header, Screen, Text } from "../../components"
import { Calendar } from 'react-native-calendars'
import { color, globalStyles } from "../../theme"
import { useNavigation } from "@react-navigation/core"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const ChaperoneScreen = observer(function ChaperoneScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const [selectedDates, setSelectedDates] = useState({})

  const SelectionStyles = {
    selected: true,
    selectedColor: 'blue',
    selectedTextColor: 'white',
  }

  const onDayPress = day => {
    if (selectedDates[day.dateString]) {
      const selectedDatesData = selectedDates
      delete selectedDatesData[day.dateString]
      setSelectedDates({ ...selectedDatesData })
    } else {
      setSelectedDates({ ...selectedDates, [day.dateString]: SelectionStyles })
    }
  }

  return (
    <View testID="ChaperoneScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="scroll">
        <Header
          headerTx="chaperoneScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
          titleStyle={{}}
        />
        <Calendar
          onDayPress={onDayPress}
          markedDates={selectedDates}
          disableArrowLeft={true}
        />
      <Text >BLUE SHOWS AVAILABLE DAYS GREY SHOWS UNAVAILABLE DAYS</Text>
      </Screen>
    </View>
  )
})
