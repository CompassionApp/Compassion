import { UserProfilePreviewModel } from "./user-profile-preview"

describe("UserProfilePreviewModel", () => {
  it("can be created", () => {
    const instance = UserProfilePreviewModel.create({
      id: "user-id",
      firstName: "Test",
      lastName: "Kim",
      email: "test@app.org",
      phoneNumber: null,
    })

    expect(instance).toBeTruthy()
    expect(instance).toMatchInlineSnapshot(`
    Object {
      "email": "test@app.org",
      "firstName": "Test",
      "id": "user-id",
      "lastName": "Kim",
      "phoneNumber": null,
    }
  `)
  })

  it("returns a full name", () => {
    const instance = UserProfilePreviewModel.create({
      id: "user-id",
      firstName: "Test",
      lastName: "Kim",
      email: "test@app.org",
      phoneNumber: null,
    })

    expect(instance.fullName).toMatchInlineSnapshot(`"Test K."`)
  })
})
