import { RequestStoreModel } from "./request-store"

test("can be created", () => {
  const instance = RequestStoreModel.create({})

  expect(instance).toBeTruthy()
})
