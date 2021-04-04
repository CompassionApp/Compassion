import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, SafeAreaView, View, ViewStyle } from "react-native"
import MapView, { LatLng, Marker } from "react-native-maps"
import { Button, Header, Screen, TextField } from "../../components"
// import { useStores } from "../../models"
import { color, globalStyles, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/core"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const MAP: ViewStyle = {
  width: Dimensions.get("window").width,
  height: 500,
}

const FOOTER: ViewStyle = {
  marginHorizontal: spacing[4],
}

const START_COORDINATE = {
  latitude: 37.804363,
  longitude: -122.271111,
  latitudeDelta: 0.0002,
  longitudeDelta: 0.0321,
}

export const RequesterScreen = observer(function RequesterScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const [, setLocation] = useState<LatLng>({
    latitude: START_COORDINATE.latitude,
    longitude: START_COORDINATE.longitude,
  })

  // Pull in navigation via hook
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

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
          <TextField placeholderTx="chaperoneScreen.pickupPlaceholder" />
          <TextField placeholderTx="chaperoneScreen.dropoffPlaceholder" />
          <Button
            testID="request-chaperone-button"
            tx="requesterScreen.requestChaperone"
            onPress={navigateBack}
          />
        </SafeAreaView>
      </Screen>
      <SafeAreaView>
        <MapView initialRegion={START_COORDINATE} style={MAP}>
          <Marker
            draggable
            coordinate={START_COORDINATE}
            onDragEnd={(e) => {
              console.tron.log("Map pin changed", e.nativeEvent.coordinate)
              setLocation(e.nativeEvent.coordinate)
            }}
          />
        </MapView>
      </SafeAreaView>
    </View>
  )
})
