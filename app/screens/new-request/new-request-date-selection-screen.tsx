import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Calendar, DateObject, DotMarking } from "react-native-calendars"
import { useNavigation } from "@react-navigation/native"
import { format, addMonths } from "date-fns"
import R from "ramda"
import { Button, Header, Screen } from "../../components"
import { color, globalStyles } from "../../theme"
import { useStores } from "../../models"
import { CALENDAR_DATE_FORMAT, REQUEST_MAX_MONTHS_FORWARD } from "../../constants"
import { Break } from "../../components/break/break"
import { NewRequestFooterArea } from "./common"

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

export const NewRequestDateSelectionScreen = observer(function NewRequestDateSelectionScreen() {
  const { newRequestStore } = useStores()
  const [selectedDate, setSelectedDate] = useState<string>(newRequestStore.requestedDate)
  const [markedDates, setMarkedDates] = useState<Record<string, DotMarking>>(
    newRequestStore.requestedDate ? { [newRequestStore.requestedDate]: SELECTION_STYLE } : {},
  )

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("newRequest", { screen: "timeSelect" })

  const handlePressNext = () => {
    if (!selectedDate) {
      return
    }

    // Date in the format of yyyy-mm-dd
    newRequestStore.setRequestedDate(selectedDate)
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
          maxDate={format(addMonths(new Date(), REQUEST_MAX_MONTHS_FORWARD), CALENDAR_DATE_FORMAT)}
        />
        <Break />
        {/* {selectedDate && (
          <Text preset={["center", "bold"]} text="12 volunteers available on this date" />
        )} */}
        <Break />
      </Screen>
      <NewRequestFooterArea step={1}>
        <Button
          tx="newRequestDateSelectionScreen.nextButton"
          disabled={!!selectedDate === false}
          onPress={handlePressNext}
        />
      </NewRequestFooterArea>
    </View>
  )
})
