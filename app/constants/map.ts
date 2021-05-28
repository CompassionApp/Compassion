import { EdgePadding, Region } from "react-native-maps"

/**
 * Seed region; currently centered at downtown Oakland, CA
 */
export const START_REGION: Region = {
  latitude: 37.804363,
  longitude: -122.271111,
  latitudeDelta: 0.0002,
  longitudeDelta: 0.0321,
}

/**
 * Default edge padding for panning to > 1 coordinates
 */
export const EDGE_PADDING: EdgePadding = {
  top: 100,
  right: 100,
  bottom: 100,
  left: 100,
}
