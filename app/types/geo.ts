/**
 * Geographical coordinate
 */
export interface LatLng {
  /**
   * @minimum -90
   * @maximum 90
   */
  lat: number
  /**
   * @minimum -180
   * @maximum 180
   */
  lng: number
}

export enum GeoAreaEnum {
  /** Oakland, CA - Chinatown */
  OAK1 = "OAK1",
  /** San Francisco - Sunset District */
  SFO1 = "SFO1",
  /** San Gabriel Valley */
  SGV1 = "SGV1",
}
