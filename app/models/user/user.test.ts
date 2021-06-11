import { UserModel } from "./user"

test("can be created", () => {
  const instance = UserModel.create({
    id: "test-user",
  })

  expect(instance).toBeTruthy()
})
