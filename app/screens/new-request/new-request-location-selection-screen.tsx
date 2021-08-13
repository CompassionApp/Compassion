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
import { debounce } from "lodash"
import { tylerAPI } from "../../config/env.js"

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
    const [currentLocation, setCurrentLocation] = useState<LatLng>(null)
    const [pickupLocation, setPickupLocation] = useState<LatLng>(null)
    const [dropoffLocation, setDropoffLocation] = useState<LatLng>(null)
    const [pickupAddress, setPickupAddress] = useState<string | null>(null)
    const [dropoffAddress, setDropoffAddress] = useState<string | null>(null)
    const [predictions, setPredictions] = useState([])

    const { newRequestStore } = useStores()

    const navigation = useNavigation()
    const navigateBack = () => navigation.goBack()
    const navigateNext = () => navigation.navigate("newRequest", { screen: "notesSelect" })

    const handlePressNext = () => {
      newRequestStore.setDestinationAddress(dropoffAddress)
      newRequestStore.setMeetAddress(pickupAddress)
      navigateNext()
    }

    const PICKUP_DROPOFF_WRAPPER: ViewStyle = {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
    }

    useEffect(() => {
      // eslint-disable-next-line
      ;(async () => {
        console.log("started map effect")
        const { status } = await Location.requestPermissionsAsync()
        if (status !== "granted") {
          console.tron.log("Permission to access location was denied")
          return
        }

        const location = await Location.getCurrentPositionAsync({})
        console.tron.log("Location: ", location)
        console.log(location.coords)
        setCurrentLocation(location.coords)

        setPickupLocation(location.coords)
        setDropoffLocation(getRandomNearbyCoordinate(location.coords))

        // mapViewRef.current.fitToCoordinates([dropoffLocation, pickupLocation], {
        //   edgePadding: EDGE_PADDING,
        // })
      })()
    }, [])

    const dragPickupMarker = (e) => {
      e.preventDefault()

      const coords = e.nativeEvent.coordinate
      console.log(coords)

      Location.reverseGeocodeAsync(coords)
        .then((res) => {
          setPickupLocation(coords)
          const { name, city, region, postalCode } = res[0]
          setPickupAddress(`${name} ${city},${region} ${postalCode}`)
        })
        .catch((err) => console.log("err", err))
    }

    const dragDropOffMarker = (e) => {
      e.preventDefault()
      const coords = e.nativeEvent.coordinate

      Location.reverseGeocodeAsync(coords)
        .then((res) => {
          setDropoffLocation(coords)
          setDropoffAddress(`${res[0].name} ${res[0].city},${res[0].region} ${res[0].postalCode}`)
        })
        .catch((err) => console.log("err", err))
    }

    const getPredictions = debounce((address) => {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${tylerAPI}&language=en&input=${address}oak&radius=2000&location=${currentLocation.latitude},${currentLocation.longitude}`

      const getData = async (url) => {
        const result = await fetch(url)
        return result.json()
      }
      getData(apiUrl)
        .then((data) => {
          setPredictions(data.predictions)
        })
        .catch((err) => {
          console.log(err)
        })
    }, 500)

    const setMarker = async (placeId, focusedTextbox) => {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?&key=${tylerAPI}&place_id=${placeId}&fields=formatted_address,geometry/location,name`

      const result = await fetch(apiUrl)
      const data = await result.json().then((res) => res.result)
      const latitude = data.geometry.location.lat
      const longitude = data.geometry.location.lng
      // slice removes country from address
      if (focusedTextbox === "pickup") {
        setPickupAddress(`${data.formatted_address.slice(0, -5)}`)
        setPickupLocation({ latitude, longitude })
      } else if (focusedTextbox === "destination") {
        setDropoffAddress(`${data.formatted_address.slice(0, -5)}`)
        setDropoffLocation({ latitude, longitude })
      }
      setPredictions([])
    }

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
                <PickupDropoff
                  totalSteps={2}
                  setMarker={setMarker}
                  pickupAddress={pickupAddress}
                  dropoffAddress={dropoffAddress}
                  predictions={predictions}
                  getPredictions={getPredictions}
                />
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
                    onDragEnd={(e) => dragPickupMarker(e)}
                    draggable
                  />
                )}
                {dropoffLocation && (
                  <Marker
                    ref={dropoffMarkerRef}
                    title="Dropoff"
                    coordinate={dropoffLocation}
                    description="Part ways with my chaperone here"
                    onDragEnd={(e) => dragDropOffMarker(e)}
                    draggable
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
