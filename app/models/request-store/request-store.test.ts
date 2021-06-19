import { getSnapshot } from "mobx-state-tree"
import { RequestStoreModel } from "./request-store"

describe("RequestStoreModel", () => {
  it("can be created", () => {
    const instance = RequestStoreModel.create({})
    expect(instance).toBeTruthy()
    expect(getSnapshot(instance)).toMatchInlineSnapshot(`
      Object {
        "availableRequests": Array [],
        "currentRequest": undefined,
        "isLoading": false,
        "requests": Array [],
      }
    `)
  })
})
