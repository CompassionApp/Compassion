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
  /** Chinatown - Oakland, CA */
  OAK1 = "OAK1",
  /** Sunset - San Francisco */
  SFO1 = "SFO1",
}
