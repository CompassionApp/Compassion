import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { RequestCard } from "./request-card"
import { RequestStatusEnum, RequestTypeEnum } from "../../types"

declare let module

storiesOf("RequestCard", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="RequestCard" usage="Default card.">
        <RequestCard
          requestId="test-id"
          requestedAt=""
          type={RequestTypeEnum.GROCERY}
          status={RequestStatusEnum.REQUESTED}
        />
      </UseCase>
    </Story>
  ))
