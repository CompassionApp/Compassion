import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { NewRequestScreen } from "../../screens"
import { NewRequestDateSelectionScreen } from "../../screens/new-request/new-request-date-selection-screen"
import { NewRequestTimeSelectionScreen } from "../../screens/new-request/new-request-time-selection-screen"
import { NewRequestLocationSelectionScreen } from "../../screens/new-request/new-request-location-selection-screen"
import { NewRequestActivitySelectionScreen } from "../../screens/new-request/new-request-activity-selection-screen"
import { NewRequestReviewScreen } from "../../screens/new-request/new-request-review-screen"

export type NewRequestNavigatorStackParamList = {
  new: undefined
  dateSelect: undefined
  timeSelect: undefined
  locationSelect: undefined
  notesSelect: undefined
  review: undefined
}

const Stack = createStackNavigator<NewRequestNavigatorStackParamList>()

export const NewRequestStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="new"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="new" component={NewRequestScreen} />
    <Stack.Screen name="dateSelect" component={NewRequestDateSelectionScreen} />
    <Stack.Screen name="timeSelect" component={NewRequestTimeSelectionScreen} />
    <Stack.Screen name="locationSelect" component={NewRequestLocationSelectionScreen} />
    <Stack.Screen name="notesSelect" component={NewRequestActivitySelectionScreen} />
    <Stack.Screen name="review" component={NewRequestReviewScreen} />
  </Stack.Navigator>
)
