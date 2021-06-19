import { generateUuid } from "./uuid"

describe("uuid utils", () => {
  describe("generateUuid", () => {
    it("should generate a uuid", () => {
      const result = generateUuid()
      expect(typeof result).toEqual("string")
      expect(result.length).toEqual(21)
    })
  })
})
