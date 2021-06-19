import { getSnapshot } from "mobx-state-tree"
import { NotificationModel, NotificationTypeEnum } from "./notification"

test("can be created", () => {
  const instance = NotificationModel.create({
    id: "abc",
    title: "Notification title",
    subtitle: "Notification subtitle",
    body: "Body",
    type: NotificationTypeEnum.NEW_REQUEST,
  })

  expect(instance).toBeTruthy()
  expect(getSnapshot(instance)).toMatchInlineSnapshot(`
    Object {
      "body": "Body",
      "data": null,
      "id": "abc",
      "subtitle": "Notification subtitle",
      "title": "Notification title",
      "type": "NEW_REQUEST",
    }
  `)
})

test("can be created with no subtitle", () => {
  const instance = NotificationModel.create({
    id: "abc",
    title: "Notification title",
    body: "Body",
    type: NotificationTypeEnum.NEW_REQUEST,
  })

  expect(instance).toBeTruthy()
  expect(getSnapshot(instance)).toMatchInlineSnapshot(`
    Object {
      "body": "Body",
      "data": null,
      "id": "abc",
      "subtitle": null,
      "title": "Notification title",
      "type": "NEW_REQUEST",
    }
  `)
  expect(instance.subtitle).toEqual(null)
})

test("can be created with data", () => {
  const instance = NotificationModel.create({
    id: "abc",
    title: "Notification title",
    body: "Body",
    type: NotificationTypeEnum.NEW_REQUEST,
    data: {
      requestId: "request-id",
    },
  })

  expect(instance).toBeTruthy()
  expect(instance.data).toBeTruthy()
  expect(getSnapshot(instance)).toMatchInlineSnapshot(`
    Object {
      "body": "Body",
      "data": Object {
        "requestAt": null,
        "requestId": "request-id",
        "sentAt": null,
      },
      "id": "abc",
      "subtitle": null,
      "title": "Notification title",
      "type": "NEW_REQUEST",
    }
  `)
})
