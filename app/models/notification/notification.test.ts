import { NotificationModel } from "./notification"

test("can be created", () => {
  const instance = NotificationModel.create({})

  expect(instance).toBeTruthy()
})
