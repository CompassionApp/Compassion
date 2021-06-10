import { UserModel } from "./user"

test("can be created", () => {
  const instance = UserModel.create({
    id: "test-user",
    emailVerified: false,
  })

  expect(instance).toBeTruthy()
})
