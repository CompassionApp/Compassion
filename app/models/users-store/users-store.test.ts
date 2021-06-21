import { UsersStoreModel } from "./users-store"

describe("UsersStoreModel", () => {
  it("can be created", () => {
    const instance = UsersStoreModel.create({})

    expect(instance).toBeTruthy()
  })
})
