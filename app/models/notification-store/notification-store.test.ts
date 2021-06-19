import { getSnapshot } from "mobx-state-tree"
import { NotificationTypeEnum } from "../notification/notification"
import { NotificationStoreModel } from "./notification-store"

describe("notification-store", () => {
  test("can be created", () => {
    const instance = NotificationStoreModel.create({
      inbox: [
        {
          id: "test",
          type: NotificationTypeEnum.NEW_REQUEST,
          title: "test",
          body: "body",
          subtitle: "",
          data: {
            requestId: "",
            requestedAt: "",
          },
        },
      ],
    })

    expect(instance).toBeTruthy()
    expect(getSnapshot(instance)).toMatchInlineSnapshot(`
      Object {
        "inbox": Array [
          Object {
            "body": "body",
            "data": Object {
              "requestAt": null,
              "requestId": "",
              "sentAt": null,
            },
            "id": "test",
            "subtitle": "",
            "title": "test",
            "type": "NEW_REQUEST",
          },
        ],
        "selectedNotification": undefined,
      }
    `)
  })

  test("can return notifications", () => {
    const instance = NotificationStoreModel.create({})

    expect(instance.notifications).toMatchInlineSnapshot(`Array []`)
  })
})
