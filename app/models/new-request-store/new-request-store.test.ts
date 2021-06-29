import { getSnapshot } from "mobx-state-tree"
import { ChaperoneRequestModel } from ".."
import { RequestTypeEnum } from "../../types"
import { createTestEnvironment } from "../../utils/mock"
import { NewRequestStoreModel } from "./new-request-store"

describe("new request store", () => {
  it("should be created", () => {
    const instance = NewRequestStoreModel.create({})

    expect(instance).toBeTruthy()
  })

  it.skip("should convert to a request", () => {
    const instance = NewRequestStoreModel.create(
      {
        requestedTime: "10:00 AM",
        requestedDate: "2021-01-01",
        meetAddress: "111 Main St",
        destinationAddress: "22 Telegraph Ave",
        otherComments: "In a blue coat",
        type: RequestTypeEnum.GROCERY,
      },
      createTestEnvironment(),
    )

    const result = instance.convertToRequest()
    expect(result).toMatchInlineSnapshot(`
      Object {
        "chaperones": Array [],
        "createdAt": "Fri, 25 Jun 2021 08:04:24 GMT",
        "destinationAddress": "22 Telegraph Ave",
        "id": "LohUUQk41RCLjkyx8Uh5L",
        "meetAddress": "111 Main St",
        "otherComments": "In a blue coat",
        "requestStatusReason": "",
        "requestedAt": "Fri, 01 Jan 2021 20:00:00 GMT",
        "requestedBy": Object {
          "email": "test@user.org",
          "firstName": "Test",
          "id": "test-user",
          "lastName": "User",
          "phoneNumber": null,
        },
        "status": "REQUESTED",
        "type": "GROCERY",
        "updatedAt": "Fri, 25 Jun 2021 08:04:24 GMT",
      }
    `)
  })

  it("should reset", () => {
    const instance = NewRequestStoreModel.create({
      requestedTime: "10:00 AM",
      requestedDate: "2021-01-01",
      meetAddress: "111 Main St",
      destinationAddress: "22 Telegraph Ave",
      otherComments: "In a blue coat",
      type: RequestTypeEnum.GROCERY,
    })
    instance.reset()
    const result = getSnapshot(instance)
    expect(result).toMatchInlineSnapshot(`
      Object {
        "destinationAddress": undefined,
        "meetAddress": undefined,
        "otherComments": undefined,
        "requestedDate": undefined,
        "requestedTime": undefined,
        "type": undefined,
      }
    `)
  })

  it("should populate from a RequestModel", () => {
    const instance = NewRequestStoreModel.create({})

    const request = ChaperoneRequestModel.create({
      id: "test-request",
      requestedAt: "Fri, 01 Jan 2021 20:00:00 GMT",
      meetAddress: "111 Main St",
      destinationAddress: "22 Telegraph Ave",
      otherComments: "In a blue coat",
      type: RequestTypeEnum.GROCERY,
      requestedBy: {
        email: "test@user.org",
        firstName: "Test",
        id: "test-user",
        lastName: "User",
        phoneNumber: null,
      },
      createdAt: "Fri, 01 Jan 2021 20:00:00 GMT",
    })
    instance.replaceFromRequest(request)

    const result = getSnapshot(instance)
    expect(result).toMatchInlineSnapshot(`
      Object {
        "destinationAddress": "22 Telegraph Ave",
        "meetAddress": "111 Main St",
        "otherComments": "In a blue coat",
        "requestedDate": "2021-01-01",
        "requestedTime": "10:00 AM",
        "type": "GROCERY",
      }
    `)
  })
})
