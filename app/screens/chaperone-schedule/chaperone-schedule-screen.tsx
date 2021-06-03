import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import R from "ramda"
import { addMonths, format, parse } from "date-fns"
// import { useStores } from "../../models"
import { Break, Button, Header, Screen, Text } from "../../components"
import { color, globalStyles } from "../../theme"
import { CALENDAR_DATE_FORMAT, CHAPERONE_MAX_MONTHS_FORWARD } from "../../constants"
import { Calendar, DateObject, DotMarking } from "react-native-calendars"
import { TimeSlot } from "./time-slot"

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

export const ChaperoneScheduleScreen = observer(function ChaperoneScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState<string>()
  const [markedDates, setMarkedDates] = useState<Record<string, DotMarking>>({})

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateHome = () => navigation.navigate("home")

  const handlePressNext = () => {
    if (!selectedDate) {
      return
    }

    const date = parse(selectedDate, CALENDAR_DATE_FORMAT, new Date()).toUTCString()
    navigateHome()
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
    <View testID="ChaperoneScheduleScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="chaperoneScheduleScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />

        <Calendar
          theme={CALENDAR_THEME}
          onDayPress={handlePressDay}
          markedDates={markedDates}
          minDate={format(new Date(), CALENDAR_DATE_FORMAT)}
          maxDate={format(
            addMonths(new Date(), CHAPERONE_MAX_MONTHS_FORWARD),
            CALENDAR_DATE_FORMAT,
          )}
        />
        <Break />
        {selectedDate && (
          <>
            <Text preset={["center", "bold"]} tx="chaperoneScheduleScreen.scheduleSlotTitle" />
            <Break />
            <TimeSlot text="8:00 AM - 11:00 AM" state="scheduled" />
            <TimeSlot text="11:00 AM - 2:00 PM" state="available" />
            <TimeSlot text="2:00 PM - 5:00 PM" state="available" />
          </>
        )}
        <Break />
        <Button
          tx="chaperoneScheduleScreen.submitButton"
          disabled={!!selectedDate === false}
          onPress={handlePressNext}
        />
      </Screen>
    </View>
  )
})
