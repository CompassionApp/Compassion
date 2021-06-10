import { RequestModel } from "./request"

test("can be created", () => {
  const instance = RequestModel.create({
    id: "test",
    requestedBy: "test@user.com",
    createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
  })

  expect(instance).toBeTruthy()
})
