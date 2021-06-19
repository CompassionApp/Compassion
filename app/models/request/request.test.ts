import { RequestModel } from "./request"

test("can be created", () => {
  const instance = RequestModel.create({
    id: "test",
    requestedBy: {
      id: "user-id",
      email: "test@test.org",
      firstName: "Test",
      lastName: "User",
    },
    createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
  })

  expect(instance).toBeTruthy()
})
