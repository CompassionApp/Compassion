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
          "requestedAt": undefined,
          "type": undefined,
        },
        "notificationStore": Object {
          "inbox": Array [],
          "selectedNotification": undefined,
        },
        "requestStore": Object {
          "availableRequests": Array [],
          "currentRequest": undefined,
          "isLoading": false,
          "requests": Array [],
        },
      }
    `)
  })
})
