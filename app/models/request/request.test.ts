import { RequestModel } from "./request"

test("can be created", () => {
  const instance = RequestModel.create({
    id: "test",
  })

  expect(instance).toBeTruthy()
})
