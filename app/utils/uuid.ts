import "react-native-get-random-values"
import { nanoid } from "nanoid"

/**
 * Generates a random uuid
 */
export const generateUuid = (): string => {
  return nanoid()
}
