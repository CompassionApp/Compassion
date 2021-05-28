import { NewRequestStoreModel } from "./new-request-store"

test("can be created", () => {
  const instance = NewRequestStoreModel.create({})

  expect(instance).toBeTruthy()
})
