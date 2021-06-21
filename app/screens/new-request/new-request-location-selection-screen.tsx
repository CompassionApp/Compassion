import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, View, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { useNavigation } from "@react-navigation/native"
import * as Location from "expo-location"
import MapView, { LatLng, Marker } from "react-native-maps"
import { Button, FlexContainer, FlexItem, Header, Screen } from "../../components"
import { color, globalStyles, spacing } from "../../theme"
import { START_REGION } from "../../constants/map"
import { useStores } from "../../models"
import PickupDropoff from "../../components/pickup-dropoff/pickup-dropoff"
import { NewRequestFooterArea } from "./common"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const MAP: ViewStyle = {
  width: Dimensions.get("window").width - spacing[4] * 2,
  minHeight: 200,
  flex: 1,
}

const FlexView = styled(FlexContainer)`
  flex-wrap: nowrap;
`

/**
 * Returns a random coordinate around a seed coordinate
 */
const getRandomNearbyCoordinate = (coord: LatLng, delta = 0.01) => ({
  latitude: coord.latitude - delta * Math.random(),
  longitude: coord.longitude - delta * Math.random(),
})

export const NewRequestLocationSelectionScreen = observer(
  function NewRequestLocationSelectionScreen() {
    const mapViewRef = useRef<MapView>(null)
    const pickupMarkerRef = useRef<Marker>(null)
    const dropoffMarkerRef = useRef<Marker>(null)
    const [, setCurrentLocation] = useState<LatLng>(null)
    const [pickupLocation, setPickupLocation] = useState<LatLng>(null)
    const [dropoffLocation, setDropoffLocation] = useState<LatLng>(null)

    const { newRequestStore } = useStores()

    const navigation = useNavigation()
    const navigateBack = () => navigation.goBack()
    const navigateNext = () => navigation.navigate("newRequest", { screen: "notesSelect" })

    const handlePressNext = () => {
      newRequestStore.setDestinationAddress("123 Test St")
      newRequestStore.setMeetAddress("234 Main Blvd")
      navigateNext()
    }

    const PICKUP_DROPOFF_WRAPPER: ViewStyle = {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
    }

    useEffect(() => {
      // eslint-disable-next-line
      ;(async () => {
        const { status } = await Location.requestPermissionsAsync()
        if (status !== "granted") {
          console.tron.log("Permission to access location was denied")
          return
        }

        const location = await Location.getCurrentPositionAsync({})
        console.tron.log("Location: ", location)
        setCurrentLocation(location.coords)

        setPickupLocation(location.coords)
        setDropoffLocation(getRandomNearbyCoordinate(location.coords))

        // mapViewRef.current.fitToCoordinates([dropoffLocation, pickupLocation], {
        //   edgePadding: EDGE_PADDING,
        // })
      })()
    }, [])

    return (
      <View testID="NewRequestLocationSelectionScreen" style={globalStyles.full}>
        <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
          <Header
            headerTx="newRequestLocationSelectionScreen.title"
            leftIcon="back"
            onLeftPress={navigateBack}
            style={globalStyles.header}
          />

          <FlexView column height="100%">
            <FlexItem>
              <View style={PICKUP_DROPOFF_WRAPPER}>
                <PickupDropoff totalSteps={2} />
              </View>
            </FlexItem>
            <FlexItem grow={1}>
              <MapView initialRegion={START_REGION} ref={mapViewRef} style={MAP}>
                {pickupLocation && (
                  <Marker
                    ref={pickupMarkerRef}
                    coordinate={pickupLocation}
                    title="Pickup"
                    description="Meet my chaperone from here"
                  />
                )}
                {dropoffLocation && (
                  <Marker
                    ref={dropoffMarkerRef}
                    title="Dropoff"
                    coordinate={dropoffLocation}
                    description="Part ways with my chaperone here"
                  />
                )}
              </MapView>
            </FlexItem>
          </FlexView>
        </Screen>
        <NewRequestFooterArea step={3}>
          <Button tx="newRequestLocationSelectionScreen.nextButton" onPress={handlePressNext} />
        </NewRequestFooterArea>
      </View>
    )
  },
)
