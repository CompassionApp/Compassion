import { TextPresets } from "./text.presets"
import { parsePresets } from "./text.utils"

describe("text utils", () => {
  describe("parsePresets", () => {
    it("should parse a single preset", () => {
      const input = "bold"
      const result = parsePresets(input)
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "fontFamily": "Quicksand-Bold",
            "fontWeight": "bold",
          },
        ]
      `)
    })

    it("should parse multiple presets", () => {
      const input: TextPresets[] = ["header", "bold"]
      const result = parsePresets(input)
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "fontSize": 24,
            "fontWeight": "bold",
          },
          Object {
            "fontFamily": "Quicksand-Bold",
            "fontWeight": "bold",
          },
        ]
      `)
    })
  })
})
