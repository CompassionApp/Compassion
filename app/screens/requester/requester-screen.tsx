import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, SafeAreaView, View, ViewStyle } from "react-native"
import MapView, { LatLng, Marker } from "react-native-maps"
import { useNavigation } from "@react-navigation/core"
import * as Location from "expo-location"
import { Button, Header, Screen, TextField } from "../../components"
// import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { EDGE_PADDING, START_REGION } from "../../constants/map"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const MAP: ViewStyle = {
  width: Dimensions.get("window").width,
  height: 450,
}

const FOOTER: ViewStyle = {
  marginHorizontal: spacing[4],
}

/**
 * Returns a random coordinate around a seed coordinate
 */
const getRandomNearbyCoordinate = (coord: LatLng, delta = 0.04) => ({
  latitude: coord.latitude - delta * Math.random(),
  longitude: coord.longitude - delta * Math.random(),
})

export const RequesterScreen = observer(function RequesterScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const mapViewRef = useRef<MapView>(null)
  const pickupMarkerRef = useRef<Marker>(null)
  const dropoffMarkerRef = useRef<Marker>(null)
  const [confirmedRoute, setConfirmedRoute] = useState<boolean>(false)
  const [currentLocation, setCurrentLocation] = useState<LatLng>(null)
  const [pickupLocation, setPickupLocation] = useState<LatLng>(null)
  const [dropoffLocation, setDropoffLocation] = useState<LatLng>(null)
  // const { request } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handlePickupFocus = () => {
    if (pickupLocation) {
      mapViewRef.current?.setCamera({ center: pickupLocation })
    }
  }
  const handlePickupInput = (text: string) => {
    if (!text) {
      setPickupLocation(null)
      setConfirmedRoute(false)
      return
    }
    if (confirmedRoute) {
      // Require user to re-confirm since the original input was changed
      setConfirmedRoute(false)
    }
    const pickupLocation = getRandomNearbyCoordinate(currentLocation)
    setPickupLocation(pickupLocation)
    mapViewRef.current?.setCamera({ center: pickupLocation })
    pickupMarkerRef.current?.showCallout()
  }

  const handleDropoffFocus = () => {
    if (dropoffLocation) {
      mapViewRef.current?.setCamera({ center: dropoffLocation })
      // dropoffMarkerRef.current?.showCallout()
    }
  }
  const handleDropoffInput = (text: string) => {
    if (!text) {
      setDropoffLocation(null)
      setConfirmedRoute(false)
      return
    }
    if (confirmedRoute) {
      // Require user to re-confirm since the original input was changed
      setConfirmedRoute(false)
    }
    const dropoffLocation = getRandomNearbyCoordinate(currentLocation)
    setDropoffLocation(dropoffLocation)
    mapViewRef.current.setCamera({ center: dropoffLocation })
    dropoffMarkerRef.current?.showCallout()
  }

  const handleConfirmLocation = () => {
    mapViewRef.current.fitToCoordinates([dropoffLocation, pickupLocation], {
      edgePadding: EDGE_PADDING,
    })
    setConfirmedRoute(true)
    // TODO: At this point, we should send a route request to the Google Maps API and display the
    // route
  }

  const handleRequestChaperone = () => {
    // Send the route details to our service

    navigateBack()
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
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
    })()
  }, [])

  return (
    <View testID="RequesterScreen" style={globalStyles.full}>
      <Screen style={{ ...ROOT }}>
        <Header
          headerTx="requesterScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <SafeAreaView style={FOOTER}>
          {/* Need geocoding service to translate a string address to lat/lon */}
          <TextField
            placeholderTx="chaperoneScreen.pickupPlaceholder"
            onChangeText={handlePickupInput}
            onFocus={handlePickupFocus}
          />
          <TextField
            placeholderTx="chaperoneScreen.dropoffPlaceholder"
            onChangeText={handleDropoffInput}
            onFocus={handleDropoffFocus}
          />
          <Button
            disabled={!dropoffLocation || confirmedRoute}
            testID="confirm-location-button"
            tx="requesterScreen.confirmLocation"
            onPress={handleConfirmLocation}
          />
          <Button
            disabled={!confirmedRoute}
            testID="request-chaperone-button"
            tx="requesterScreen.requestChaperone"
            onPress={handleRequestChaperone}
          />
        </SafeAreaView>
      </Screen>
      <SafeAreaView>
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
      </SafeAreaView>
    </View>
  )
})
