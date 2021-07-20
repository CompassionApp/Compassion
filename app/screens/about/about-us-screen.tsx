import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Break, Header, Screen, Text } from "../../components"
import { color, globalStyles, spacing } from "../../theme"
export const headerLogo = require("../../../assets/header.png")

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

// probably want to export these
const HEADER_LOGO_WIDTH = 215
const HEADER_LOGO_HEIGHT = 68

const LOGO_IMAGE: ImageStyle = {
  marginBottom: spacing[1],
  alignSelf: "center",
  width: HEADER_LOGO_WIDTH,
  height: HEADER_LOGO_HEIGHT,
}

export const AboutUsScreen = observer(function AboutUsScreen() {
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  return (
    <View testID="AboutUsScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Image source={headerLogo} resizeMethod="auto" style={LOGO_IMAGE} />

        <Header
          headerTx="aboutUsScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />

        <Text>
          Compassion in Oakland was formed in response to the surge of anti-Asian attacks --
          particularly in California’s Bay Area.{" "}
        </Text>
        <Break />
        <Text>
          Like many, Jacob Azevedo, grew fed up with the violence and in a viral social media post,
          offered to chaperone anyone within Oakland’s Chinatown neighborhood to help them feel
          safer. Inspired by his bravery, hundreds messaged him to join him. Thus was born the
          movement for the community to come together to support our Elderly Asians.{" "}
        </Text>
        <Break />
        <Text preset="bold"> “I just wanted to offer people some kind of comfort” </Text>
        <Break />
        <Text>
          Already feeling the urge to protect their elders, four local Bay Area residents answered
          the call. They got to work by organizing and mobilizing quickly. Since then, over 400
          volunteers have come forward from all across the Bay of all different backgrounds, to
          stand against AAPI hate. With so much support, together the 5 leaders imagined and founded
          Compassion In Oakland.
        </Text>
        <Break />
        <Text>Our mission is simple: </Text>
        <Break />
        <Text>
          We strive to provide the Oakland Chinatown Community with a resource for promoting safety
          and community. We aim to embrace the often forgotten, underserved, and vulnerable. We
          promote compassion not indifference, unity as opposed to divisiveness. Fostering a more
          caring and safer Oakland for all.
        </Text>
        <Break />
      </Screen>
    </View>
  )
})
