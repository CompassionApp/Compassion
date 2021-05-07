import * as React from "react"
import { View, Alert } from "react-native"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { Footer } from "./footer"
import { color } from "../../theme"

declare let module

const VIEWSTYLE = {
  flex: 1,
  backgroundColor: color.storybookDarkBg,
}

storiesOf("Footer", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noPad text="default" usage="The default usage">
        <View style={VIEWSTYLE}>
          <Footer footerTx="demoScreen.howTo" />
        </View>
      </UseCase>
      <UseCase noPad text="leftIcon" usage="A left nav icon">
        <View style={VIEWSTYLE}>
          <Footer
            footerTx="demoScreen.howTo"
            leftIcon="back"
            onLeftPress={() => Alert.alert("left nav")}
          />
        </View>
      </UseCase>
      <UseCase noPad text="rightIcon" usage="A right nav icon">
        <View style={VIEWSTYLE}>
          <Footer
            footerTx="demoScreen.howTo"
            rightIcon="bullet"
            onRightPress={() => Alert.alert("right nav")}
          />
        </View>
      </UseCase>
    </Story>
  ))
