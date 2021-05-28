import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Calendar, DateObject, DotMarking } from "react-native-calendars"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles } from "../../theme"
import { Footer } from "../../components/footer/footer"
import { format, addMonths, parse } from "date-fns"
import { useStores } from "../../models"
import { CALENDAR_DATE_FORMAT } from "../../constants/date-formats"
import R from "ramda"
import { Break } from "../../components/break/break"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const SELECTION_STYLE: DotMarking = {
  selected: true,
  selectedColor: color.palette.blue,
}

const CALENDAR_THEME = {
  backgroundColor: color.background,
  calendarBackground: color.background,
}

/** Allow scheduling for n months from the current date */
const MAX_MONTHS_FORWARD = 2

export const NewRequestDateSelectionScreen = observer(function NewRequestDateSelectionScreen() {
  const { newRequestStore } = useStores()
  const [selectedDate, setSelectedDate] = useState<string>()
  const [markedDates, setMarkedDates] = useState<Record<string, DotMarking>>({})

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("newRequest", { screen: "timeSelect" })

  const handlePressNext = () => {
    if (!selectedDate) {
      return
    }

    const date = parse(selectedDate, CALENDAR_DATE_FORMAT, new Date()).toUTCString()
    newRequestStore.request.setRequestDateTime(date)
    navigateNext()
  }

  const handlePressDay = (day: DateObject) => {
    // Toggle date selection
    if (selectedDate === day.dateString) {
      setSelectedDate(undefined)
    } else {
      setSelectedDate(day.dateString)
    }

    // Toggle marking
    if (markedDates[day.dateString]) {
      const markedDatesClone = R.clone(markedDates)
      delete markedDatesClone[day.dateString]
      setMarkedDates(markedDatesClone)
    } else {
      setMarkedDates({ [day.dateString]: SELECTION_STYLE })
    }
  }

  return (
    <View testID="NewRequestDateSelectionScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="newRequestDateSelectionScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />

        <Calendar
          theme={CALENDAR_THEME}
          onDayPress={handlePressDay}
          markedDates={markedDates}
          minDate={format(new Date(), CALENDAR_DATE_FORMAT)}
          maxDate={format(addMonths(new Date(), MAX_MONTHS_FORWARD), CALENDAR_DATE_FORMAT)}
        />
        <Break />
        {selectedDate && (
          <Text preset={["center", "bold"]} text="12 volunteers available on this date" />
        )}
        <Break />
        <Button
          tx="newRequestDateSelectionScreen.nextButton"
          disabled={!!selectedDate === false}
          onPress={handlePressNext}
        />
      </Screen>
      <Footer />
    </View>
  )
})
