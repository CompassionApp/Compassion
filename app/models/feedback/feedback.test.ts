import { FeedbackTypeEnum } from "../../types"
import { FeedbackModel } from "./feedback"

test("can be created", () => {
  const instance = FeedbackModel.create({
    id: "5cc66a70-50a0-4df0-879b-6a4636c18a41",
    createdAt: "2021-01-01 11:00:00",
    updatedAt: "2021-01-01 11:00:00",
    submittedBy: "5cc66a70-50a0-4df0-879b-6a4636c18a41",
    type: FeedbackTypeEnum.SESSION_FEEDBACK,
    comments: "comment",
  })

  expect(instance).toBeTruthy()
})
