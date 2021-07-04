import { getSnapshot } from "mobx-state-tree"
import { RootStoreModel } from "./root-store"

describe("RootStoreModel", () => {
  it("can be created", () => {
    const instance = RootStoreModel.create({})
    expect(instance).toBeTruthy()
    expect(getSnapshot(instance)).toMatchInlineSnapshot(`
      Object {
        "authStore": Object {
          "user": undefined,
        },
        "newRequestStore": Object {
          "destinationAddress": undefined,
          "meetAddress": undefined,
          "otherComments": undefined,
          "requestedDate": undefined,
          "requestedTime": undefined,
          "type": undefined,
        },
        "notificationStore": Object {
          "inbox": Array [],
          "selectedNotification": undefined,
          "userNotificationSubscriptionActive": false,
        },
        "requestStore": Object {
          "availableRequestSubscriptionActive": false,
          "availableRequests": Array [],
          "currentRequest": undefined,
          "requests": Array [],
          "userRequestSubscriptionActive": false,
        },
        "usersStore": Object {
          "selectedUser": undefined,
          "users": Array [],
        },
      }
    `)
  })
})
