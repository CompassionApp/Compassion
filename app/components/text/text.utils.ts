import { ValueOfRecord } from "ramda"
import { presets, TextPresets } from "./text.presets"

/**
 * Parses a `preset` prop that can either be a single preset or an array.
 *
 * Runs a validation and returns an array of presets.
 *
 * @param preset
 */
export const parsePresets = (
  preset: TextPresets | TextPresets[],
): ValueOfRecord<typeof presets>[] => {
  let combinedPresets: ValueOfRecord<typeof presets>[] = []

  // Single preset
  if (!Array.isArray(preset)) {
    if (!presets[preset]) {
      console.warn(`Unknown preset ${preset} used in <Text />`)
    } else {
      combinedPresets = [presets[preset]]
    }
  } else {
    preset.forEach((preset) => {
      if (!presets[preset]) {
        console.warn(`Unknown preset ${preset} used in <Text />`)
      } else {
        combinedPresets.push(presets[preset])
      }
    })
  }

  return combinedPresets
}
