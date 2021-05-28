import * as React from "react"
import { View } from "react-native"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import ProgressIndicator from "./progressIndicator"

declare let module

const VIEWSTYLE = {
  flex: 1,
  backgroundColor: color.storybookDarkBg,
}

storiesOf("progressIndicator", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noPad text="default" usage="The default usage">
        <View style={VIEWSTYLE}>
          <ProgressIndicator currentStep={3} totalSteps={5} />
        </View>
      </UseCase>
      <UseCase noPad text="do completed steps" usage="The default usage">
        <View style={VIEWSTYLE}>
          <ProgressIndicator currentStep={0} totalSteps={5} />
        </View>
      </UseCase>
      <UseCase noPad text="all steps completed" usage="The default usage">
        <View style={VIEWSTYLE}>
          <ProgressIndicator currentStep={5} totalSteps={5} />
        </View>
      </UseCase>
    </Story>
  ))
