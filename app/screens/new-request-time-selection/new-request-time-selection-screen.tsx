import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles, spacing } from "../../theme"
import { Footer } from "../../components/footer/footer"
import { format, parse } from "date-fns"
import { useStores } from "../../models"
import styled from "styled-components/native"
import { Break } from "../../components/break/break"
import { TIME_RANGE_FORMAT, TITLE_DATE_FORMAT } from "../../constants/date-formats"
import { isInOperatingHours, TimeAmPmEnum } from "./utils"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const AmPmSelectionContainer = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
`

const TimeSelectionContainer = styled.View`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin-left: ${spacing[1]}px;
`

const PillButton = styled(Button)<{ selected?: boolean }>`
  min-width: 80px;
  margin-right: ${spacing[1]}px;
  background-color: ${color.palette.grey3};

  ${({ selected }) => (selected ? `background-color: ${color.primary}` : "")}
`

const TIME_ARRAY = [
  "7:00",
  "7:30",
  "8:00",
  "8:30",
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "1:00",
  "1:30",
  "2:00",
  "2:30",
  "3:00",
  "3:30",
  "4:00",
  "4:30",
  "5:00",
  "5:30",
  "6:00",
  "6:30",
]

/** Time range (inclusive) of operating hours. Use this to determine which times ranges to disable entirely. */
const OPERATING_HOURS: [string, string] = ["7:00 AM", "8:00 PM"]

export const NewRequestTimeSelectionScreen = observer(function NewRequestTimeSelectionScreen() {
  const { newRequestStore } = useStores()
  const { request } = newRequestStore
  const navigation = useNavigation()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [selectedAmPm, setSelectedAmPm] = useState<string>(TimeAmPmEnum.AM)

  const requestDate = request?.requestedAt ? new Date(request.requestedAt) : new Date()
  const requestDateString = format(requestDate, TITLE_DATE_FORMAT)

  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("newRequest", { screen: "locationSelect" })

  const handlePressNext = () => {
    if (!selectedAmPm || !selectedTime) {
      return
    }
    // Construct a date using the request date from the previous page
    const parsedTime = parse(`${selectedTime} ${selectedAmPm}`, TIME_RANGE_FORMAT, requestDate)
    newRequestStore.request.setRequestDateTime(parsedTime.toUTCString())
    navigateNext()
  }

  const handleSelectAmPm = (value: string) => () => {
    setSelectedAmPm(value)
    // Clear the time selection if it's invalid as we switch between am/pm
    if (!isInOperatingHours(`${selectedTime} ${value}`, OPERATING_HOURS)) {
      setSelectedTime(undefined)
    }
  }
  const handleSelectTime = (value: string) => () => setSelectedTime(value)

  return (
    <View testID="NewRequestTimeSelectionScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="newRequestTimeSelectionScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />

        <Text preset={["header", "bold", "center"]}>{requestDateString}</Text>
        <AmPmSelectionContainer>
          <PillButton
            text={TimeAmPmEnum.AM}
            selected={selectedAmPm === TimeAmPmEnum.AM}
            onPress={handleSelectAmPm(TimeAmPmEnum.AM)}
          />
          <PillButton
            text={TimeAmPmEnum.PM}
            selected={selectedAmPm === TimeAmPmEnum.PM}
            onPress={handleSelectAmPm(TimeAmPmEnum.PM)}
          />
        </AmPmSelectionContainer>

        <Break />

        <TimeSelectionContainer>
          {TIME_ARRAY.map((time) => (
            <PillButton
              key={time}
              text={time}
              selected={selectedTime === time}
              disabled={!isInOperatingHours(`${time} ${selectedAmPm}`, OPERATING_HOURS)}
              onPress={handleSelectTime(time)}
            />
          ))}
        </TimeSelectionContainer>

        <Button
          tx="newRequestTimeSelectionScreen.nextButton"
          disabled={!!selectedAmPm === false || !!selectedTime === false}
          onPress={handlePressNext}
        />
      </Screen>
      <Footer />
    </View>
  )
})
