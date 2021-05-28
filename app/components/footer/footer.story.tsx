import * as React from "react"
import { View } from "react-native"
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
          <Footer />
        </View>
      </UseCase>
    </Story>
  ))
