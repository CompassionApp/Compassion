import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { Card } from "./card"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"

declare let module

storiesOf("Card", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Card" usage="Default card.">
        <Card
          requestId="test-id"
          requestedAt=""
          type={RequestTypeEnum.GROCERY}
          status={RequestStatusEnum.REQUESTED}
        />
      </UseCase>
    </Story>
  ))
