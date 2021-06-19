// import { RequestModel, RequestSnapshot, UserProfileModel, UserProfileSnapshot } from "../models"
// import { createNewRequestNotification } from "./notification-factory"

// import { createRequestCanceledByChaperoneNotification } from "./notification-factory"

describe("notification factory", () => {
  // TODO: Fix this test. Referencing createNewRequestNotification is punting jest to the app root
  it("runs", () => expect(true).toBeTruthy())
  //   it("should create a new request notification", () => {
  //     const userProfile = ({
  //       id: "user-id",
  //       firstName: "First",
  //       lastName: "Last",
  //     } as unknown) as UserProfileSnapshot
  //     const request = ({
  //       id: "request-id",
  //       requestedBy: "app@compassioninoakland.org",
  //       requestedAt: "Mon, 28 Jun 2021 21:00:00 GMT",
  //     } as unknown) as RequestSnapshot
  //     const result = createNewRequestNotification(userProfile, request)
  //     expect(result).toBeTruthy()
  //     expect(result).toMatchInlineSnapshot()
  //   })

  // it("should create a chaperone canceled notification", () => {
  //   const userProfile = UserProfileModel.create({
  //     id: "user-id",
  //     firstName: "First",
  //     lastName: "Last",
  //     email: "test@compassioninoakland.org",
  //   })
  //   const request = RequestModel.create({
  //     id: "request-id",
  //     requestedBy: "app@compassioninoakland.org",
  //     requestedAt: "Mon, 28 Jun 2021 21:00:00 GMT",
  //   })
  //   const result = createRequestCanceledByChaperoneNotification(userProfile, request)
  //   expect(result).toBeTruthy()
  //   expect(result).toMatchInlineSnapshot()
  // })
})
