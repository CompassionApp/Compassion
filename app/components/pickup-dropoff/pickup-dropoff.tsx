import React, { useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { color } from "../../theme"
import { TextField } from "../text-field/text-field"
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

const PickupDropoffItemView = ({ isFirstItem }: PickupDropoffItemViewProps) => {
  return (
    <>
      {!isFirstItem && <View style={LOCATION_BAR_STYLES} />}
      <View style={LOCATION_DOT_STYLES} />
    </>
  )
}

const PickupDropoff = ({ totalSteps }: PickupDropoffProps): JSX.Element | null => {
  const [focusedTextbox, setFocusedTextbox] = useState<string>("")
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
          inputStyle={focusedTextbox === "pickup" && ON_TEXT_INPUT_BORDER}
          onFocus={() => setFocusedTextbox("pickup")}
        />
        <TextField
          placeholderTx="newRequestLocationSelectionScreen.destinationPlaceholder"
          inputStyle={focusedTextbox === "destination" && ON_TEXT_INPUT_BORDER}
          onFocus={() => setFocusedTextbox("destination")}
        />
      </View>
    </View>
  )
}

export default PickupDropoff
