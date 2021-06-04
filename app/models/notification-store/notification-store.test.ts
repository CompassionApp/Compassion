import { NotificationStoreModel } from "./notification-store"

test("can be created", () => {
  const instance = NotificationStoreModel.create({})

  expect(instance).toBeTruthy()
})
