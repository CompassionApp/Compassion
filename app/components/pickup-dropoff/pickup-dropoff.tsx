import React, { useState } from "react"
import { View, ViewStyle, TextStyle, TouchableHighlight } from "react-native"
import { color, typography } from "../../theme"
import { TextField } from "../text-field/text-field"
import { Text } from "../text/text"
import { PickupDropoffProps, PickupDropoffItemViewProps } from "./pickup-dropoff.props"

const LOCATION_AREA_WRAPPER: ViewStyle = { marginTop: 30 }
const LOCATION_BAR_STYLES: ViewStyle = {
  width: 3.5,
  height: 65,
  backgroundColor: color.palette.blue,
  marginLeft: 5.5,
}
const LOCATION_DOT_STYLES: ViewStyle = {
  borderRadius: 15,
  width: 15,
  height: 15,
  backgroundColor: color.palette.blue,
}
const TEXT_BOX_STYLE: ViewStyle = { flexDirection: "column", width: "90%" }
const LOCATION_STYLE: ViewStyle = { justifyContent: "space-between", flexDirection: "row" }
const ON_TEXT_INPUT_BORDER: TextStyle = {
  borderColor: color.palette.blue,
  borderWidth: 3,
  borderRadius: 8,
}
const PREDICTIONS_STYLE: ViewStyle = {
  borderStyle: "solid",
  borderColor: color.line,
  borderBottomWidth: 1,
  borderRadius: 4,
}
const USER_SEARCH_STYLE: TextStyle = {
  fontFamily: typography.secondary,
}

const PickupDropoffItemView = ({ isFirstItem }: PickupDropoffItemViewProps) => {
  return (
    <>
      {!isFirstItem && <View style={LOCATION_BAR_STYLES} />}
      <View style={LOCATION_DOT_STYLES} />
    </>
  )
}

const PickupDropoff = ({
  totalSteps,
  setMarker,
  pickupAddress,
  dropoffAddress,
  predictions,
  getPredictions,
}: PickupDropoffProps): JSX.Element | null => {
  const [focusedTextbox, setFocusedTextbox] = useState<string>("")
  const [displayPredictions, setDisplayPredictions] = useState<boolean>(true)

  const handleInputSelect = (input) => {
    setDisplayPredictions(true)
    setFocusedTextbox(input)
  }

  const handlePredictionPress = (prediction) => {
    setMarker(prediction.place_id, focusedTextbox)
    setDisplayPredictions(false)
  }

  const renderGooglePredictions = predictions.map((prediction) => (
    <TouchableHighlight
      key={prediction.place_id}
      onPress={() => handlePredictionPress(prediction)}
      underlayColor={color.dim}
      activeOpacity={0.6}
    >
      <View style={PREDICTIONS_STYLE}>
        <Text style={USER_SEARCH_STYLE}>{prediction.structured_formatting.main_text}</Text>
        <Text>{prediction.structured_formatting.secondary_text.slice(0, -5)}</Text>
      </View>
    </TouchableHighlight>
  ))

  return (
    <View style={LOCATION_STYLE}>
      <View style={LOCATION_AREA_WRAPPER}>
        {[...Array(totalSteps)].map((__, index) => (
          <PickupDropoffItemView key={index} isFirstItem={index === 0} />
        ))}
      </View>
      <View style={TEXT_BOX_STYLE}>
        <TextField
          placeholderTx="newRequestLocationSelectionScreen.pickupPlaceholder"
          defaultValue={pickupAddress}
          inputStyle={focusedTextbox === "pickup" && ON_TEXT_INPUT_BORDER}
          onFocus={() => handleInputSelect("pickup")}
          onChangeText={(text) => getPredictions(text)}
        />
        <TextField
          placeholderTx="newRequestLocationSelectionScreen.destinationPlaceholder"
          defaultValue={dropoffAddress}
          inputStyle={focusedTextbox === "destination" && ON_TEXT_INPUT_BORDER}
          onFocus={() => handleInputSelect("destination")}
          onChangeText={(text) => getPredictions(text)}
        />
        {displayPredictions && renderGooglePredictions}
      </View>
    </View>
  )
}
export default PickupDropoff
