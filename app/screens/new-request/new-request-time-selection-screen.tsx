import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Button, FlexContainer, Header, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, globalStyles, spacing } from "../../theme"
import { format, parse } from "date-fns"
import { useStores } from "../../models"
import styled from "styled-components/native"
import { Break } from "../../components/break/break"
import { CALENDAR_DATE_FORMAT, TITLE_DATE_FORMAT } from "../../constants/date-formats"
import { isInOperatingHours, TimeAmPmEnum } from "./utils"
import { NewRequestFooterArea } from "./common"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const AmPmSelectionContainer = styled(FlexContainer)``

const TimeSelectionContainer = styled(FlexContainer)`
  flex-flow: row wrap;
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
  const navigation = useNavigation()
  const [selectedTime, setSelectedTime] = useState<string>(newRequestStore.rawTime)
  const [selectedAmPm, setSelectedAmPm] = useState<string>(newRequestStore.amPm ?? TimeAmPmEnum.AM)
  const requestDate = newRequestStore?.requestedDate
    ? parse(newRequestStore.requestedDate, CALENDAR_DATE_FORMAT, new Date())
    : new Date()
  const requestDateString = format(requestDate, TITLE_DATE_FORMAT)

  const navigateBack = () => navigation.goBack()
  const navigateNext = () => navigation.navigate("newRequest", { screen: "locationSelect" })

  const handlePressNext = () => {
    if (!selectedAmPm || !selectedTime) {
      return
    }
    newRequestStore.setRequestedTime(`${selectedTime} ${selectedAmPm}`)
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
        <AmPmSelectionContainer justifyCenter width="100%">
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

        <TimeSelectionContainer width="100%">
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
      </Screen>
      <NewRequestFooterArea step={2}>
        <Button
          tx="newRequestTimeSelectionScreen.nextButton"
          disabled={!!selectedAmPm === false || !!selectedTime === false}
          onPress={handlePressNext}
        />
      </NewRequestFooterArea>
    </View>
  )
})
