import { RequestModel } from "./request"

test("can be created", () => {
  const instance = RequestModel.create({})

  expect(instance).toBeTruthy()
})
