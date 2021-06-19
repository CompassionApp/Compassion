import { convert12to24Hour, isInOperatingHours } from "./utils"

describe("utils", () => {
  describe("convert12to24Hour", () => {
    it("should convert 1:30 AM", () => {
      const input = "1:30 AM"
      const expected = 1.5
      const result = convert12to24Hour(input)
      expect(result).toEqual(expected)
    })

    it("should convert 11:45 PM", () => {
      const input = "11:45 PM"
      const expected = 23.75
      const result = convert12to24Hour(input)
      expect(result).toEqual(expected)
    })

    it("should convert 12:00 AM", () => {
      const input = "12:00 AM"
      const expected = 0
      const result = convert12to24Hour(input)
      expect(result).toEqual(expected)
    })

    it("should convert 12:05 AM", () => {
      const input = "12:05 AM"
      const expected = 0.0833
      const result = convert12to24Hour(input)
      expect(result).toBeCloseTo(expected)
    })
  })

  describe("isInOperatingHours", () => {
    it("should return undefined", () => {
      const input = "1:30"
      const operatingHours: [string, string] = ["1:00 AM", "2:30 AM"]
      const expected = true
      const result = isInOperatingHours(input, operatingHours)
      expect(result).toEqual(expected)
    })

    it("should verify operating hours", () => {
      const input = "1:30 AM"
      const operatingHours: [string, string] = ["1:00 AM", "2:30 AM"]
      const expected = true
      const result = isInOperatingHours(input, operatingHours)
      expect(result).toEqual(expected)
    })

    it("should verify operating hours", () => {
      const input = "6:00 PM"
      const operatingHours: [string, string] = ["8:00 AM", "6:30 PM"]
      const expected = true
      const result = isInOperatingHours(input, operatingHours)
      expect(result).toEqual(expected)
    })

    it("should verify operating hours", () => {
      const input = "6:45 PM"
      const operatingHours: [string, string] = ["8:00 AM", "6:30 PM"]
      const expected = false
      const result = isInOperatingHours(input, operatingHours)
      expect(result).toEqual(expected)
    })
  })
})
