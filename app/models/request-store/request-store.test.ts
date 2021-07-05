import { getSnapshot } from "mobx-state-tree"
import { RequestStatusEnum, RequestActivityEnum } from "../../types"
import { RequestStoreModel } from "./request-store"

describe("RequestStoreModel", () => {
  it("should be created", () => {
    const instance = RequestStoreModel.create({})
    expect(instance).toBeTruthy()
    expect(getSnapshot(instance)).toMatchInlineSnapshot(`
      Object {
        "availableRequestSubscriptionActive": false,
        "availableRequests": Array [],
        "currentRequest": undefined,
        "requests": Array [],
        "userRequestSubscriptionActive": false,
      }
    `)
  })

  it("should replace available requests", () => {
    const instance = RequestStoreModel.create({})
    const payload = [
      {
        chaperones: [],
        createdAt: "Sat, 26 Jun 2021 08:10:37 GMT",
        destinationAddress: "123 Test St",
        id: "dRykFdRsmbXASglRKZ5LG",
        meetAddress: "234 Main Blvd",
        otherComments: "",
        requestStatusReason: "",
        requestedAt: "Sun, 04 Jul 2021 21:00:00 GMT",
        requestedBy: {
          email: "app@compassioninoakland.org",
          firstName: "Halmeoni",
          id: "KLOfJBrvHwSpK6H44zLY97BRZVC3",
          lastName: "Requester",
          phoneNumber: "1115553331",
        },
        status: RequestStatusEnum.SCHEDULED,
        activity: RequestActivityEnum.GROCERY,
        updatedAt: "Sat, 26 Jun 2021 08:10:51 GMT",
      },
    ]

    instance._replaceAvailableRequests(payload)
    expect(instance.availableRequests).toMatchInlineSnapshot(`
      Array [
        Object {
          "activity": "GROCERY",
          "chaperones": Array [],
          "createdAt": "Sat, 26 Jun 2021 08:10:37 GMT",
          "destinationAddress": "123 Test St",
          "id": "dRykFdRsmbXASglRKZ5LG",
          "meetAddress": "234 Main Blvd",
          "otherComments": "",
          "requestStatusReason": "",
          "requestedAt": "Sun, 04 Jul 2021 21:00:00 GMT",
          "requestedBy": Object {
            "email": "app@compassioninoakland.org",
            "firstName": "Halmeoni",
            "id": "KLOfJBrvHwSpK6H44zLY97BRZVC3",
            "lastName": "Requester",
            "phoneNumber": "1115553331",
          },
          "status": "SCHEDULED",
          "updatedAt": "Sat, 26 Jun 2021 08:10:51 GMT",
        },
      ]
    `)
  })

  it("should replace requests", () => {
    const instance = RequestStoreModel.create({})
    const payload = [
      {
        chaperones: [],
        createdAt: "Sat, 26 Jun 2021 08:10:37 GMT",
        destinationAddress: "123 Test St",
        id: "dRykFdRsmbXASglRKZ5LG",
        meetAddress: "234 Main Blvd",
        otherComments: "",
        requestStatusReason: "",
        requestedAt: "Sun, 04 Jul 2021 21:00:00 GMT",
        requestedBy: {
          email: "app@compassioninoakland.org",
          firstName: "Halmeoni",
          id: "KLOfJBrvHwSpK6H44zLY97BRZVC3",
          lastName: "Requester",
          phoneNumber: "1115553331",
        },
        status: RequestStatusEnum.SCHEDULED,
        activity: RequestActivityEnum.GROCERY,
        updatedAt: "Sat, 26 Jun 2021 08:10:51 GMT",
      },
    ]

    instance._replaceRequests(payload)
    expect(instance.requests).toMatchInlineSnapshot(`
      Array [
        Object {
          "activity": "GROCERY",
          "chaperones": Array [],
          "createdAt": "Sat, 26 Jun 2021 08:10:37 GMT",
          "destinationAddress": "123 Test St",
          "id": "dRykFdRsmbXASglRKZ5LG",
          "meetAddress": "234 Main Blvd",
          "otherComments": "",
          "requestStatusReason": "",
          "requestedAt": "Sun, 04 Jul 2021 21:00:00 GMT",
          "requestedBy": Object {
            "email": "app@compassioninoakland.org",
            "firstName": "Halmeoni",
            "id": "KLOfJBrvHwSpK6H44zLY97BRZVC3",
            "lastName": "Requester",
            "phoneNumber": "1115553331",
          },
          "status": "SCHEDULED",
          "updatedAt": "Sat, 26 Jun 2021 08:10:51 GMT",
        },
      ]
    `)
  })

  it("should update requests", () => {
    const instance = RequestStoreModel.create({
      requests: [
        {
          chaperones: [],
          createdAt: "Sat, 26 Jun 2021 08:10:37 GMT",
          destinationAddress: "123 Test St",
          id: "dRykFdRsmbXASglRKZ5LG",
          meetAddress: "234 Main Blvd",
          otherComments: "",
          requestStatusReason: "",
          requestedAt: "Sun, 04 Jul 2021 21:00:00 GMT",
          requestedBy: {
            email: "app@compassioninoakland.org",
            firstName: "Halmeoni",
            id: "KLOfJBrvHwSpK6H44zLY97BRZVC3",
            lastName: "Requester",
            phoneNumber: "1115553331",
          },
          status: RequestStatusEnum.SCHEDULED,
          activity: RequestActivityEnum.GROCERY,
          updatedAt: "Sat, 26 Jun 2021 08:10:51 GMT",
        },
      ],
    })

    instance._updateRequest("dRykFdRsmbXASglRKZ5LG", {
      status: RequestStatusEnum.CANCELED_BY_CHAPERONE,
    })
    expect(instance.requests[0].status).toEqual(RequestStatusEnum.CANCELED_BY_CHAPERONE)
  })

  it("should delete a request", () => {
    const instance = RequestStoreModel.create({
      requests: [
        {
          chaperones: [],
          createdAt: "Sat, 26 Jun 2021 08:10:37 GMT",
          destinationAddress: "123 Test St",
          id: "dRykFdRsmbXASglRKZ5LG",
          meetAddress: "234 Main Blvd",
          otherComments: "",
          requestStatusReason: "",
          requestedAt: "Sun, 04 Jul 2021 21:00:00 GMT",
          requestedBy: {
            email: "app@compassioninoakland.org",
            firstName: "Halmeoni",
            id: "KLOfJBrvHwSpK6H44zLY97BRZVC3",
            lastName: "Requester",
            phoneNumber: "1115553331",
          },
          status: RequestStatusEnum.SCHEDULED,
          activity: RequestActivityEnum.GROCERY,
          updatedAt: "Sat, 26 Jun 2021 08:10:51 GMT",
        },
        {
          chaperones: [],
          createdAt: "Sat, 26 Jun 2021 08:10:37 GMT",
          destinationAddress: "123 Test St",
          id: "ksdkwwww4fakdjf",
          meetAddress: "234 Main Blvd",
          otherComments: "",
          requestStatusReason: "",
          requestedAt: "Sun, 04 Jul 2021 21:00:00 GMT",
          requestedBy: {
            email: "app@compassioninoakland.org",
            firstName: "Halmeoni",
            id: "KLOfJBrvHwSpK6H44zLY97BRZVC3",
            lastName: "Requester",
            phoneNumber: "1115553331",
          },
          status: RequestStatusEnum.SCHEDULED,
          activity: RequestActivityEnum.GROCERY,
          updatedAt: "Sat, 26 Jun 2021 08:10:51 GMT",
        },
      ],
    })
    expect(instance.requests).toHaveLength(2)
    instance._deleteRequest("dRykFdRsmbXASglRKZ5LG")
    expect(instance.requests).toHaveLength(1)
  })

  it("should clear", () => {
    const instance = RequestStoreModel.create({
      requests: [
        {
          chaperones: [],
          createdAt: "Sat, 26 Jun 2021 08:10:37 GMT",
          destinationAddress: "123 Test St",
          id: "dRykFdRsmbXASglRKZ5LG",
          meetAddress: "234 Main Blvd",
          otherComments: "",
          requestStatusReason: "",
          requestedAt: "Sun, 04 Jul 2021 21:00:00 GMT",
          requestedBy: {
            email: "app@compassioninoakland.org",
            firstName: "Halmeoni",
            id: "KLOfJBrvHwSpK6H44zLY97BRZVC3",
            lastName: "Requester",
            phoneNumber: "1115553331",
          },
          status: RequestStatusEnum.SCHEDULED,
          activity: RequestActivityEnum.GROCERY,
          updatedAt: "Sat, 26 Jun 2021 08:10:51 GMT",
        },
      ],
      availableRequests: [
        {
          chaperones: [],
          createdAt: "Sat, 26 Jun 2021 08:10:37 GMT",
          destinationAddress: "123 Test St",
          id: "ksdkwwww4fakdjf",
          meetAddress: "234 Main Blvd",
          otherComments: "",
          requestStatusReason: "",
          requestedAt: "Sun, 04 Jul 2021 21:00:00 GMT",
          requestedBy: {
            email: "app@compassioninoakland.org",
            firstName: "Halmeoni",
            id: "KLOfJBrvHwSpK6H44zLY97BRZVC3",
            lastName: "Requester",
            phoneNumber: "1115553331",
          },
          status: RequestStatusEnum.SCHEDULED,
          activity: RequestActivityEnum.GROCERY,
          updatedAt: "Sat, 26 Jun 2021 08:10:51 GMT",
        },
      ],
    })
    instance.clear()
    expect(instance.requests).toHaveLength(0)
    expect(instance.availableRequests).toHaveLength(0)
  })
})
