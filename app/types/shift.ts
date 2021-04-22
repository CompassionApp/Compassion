import { LatLng } from "./geo"
import { UserID } from "./user"

/**
 * @format uuid
 */
export type ShiftID = string

/**
 * Schedule represents a single contiguous availability interval for a chaperone
 */
export interface Shift {
  /**
   * Primary key
   */
  id: ShiftID

  /**
   * @format date-time
   */
  createdAt: string

  /**
   * @format date-time
   */
  updatedAt: string

  /**
   * Chaperone that this shift belongs to
   */
  chaperoneId: UserID

  /**
   * @format date-time
   */
  startTime: string

  /**
   * @format date-time
   */
  endTime: string

  /**
   * @minimum 0
   * @maximum 6
   */
  dayOfWeek: number

  /**
   * @minimum 2021
   * @maximum 2050
   */
  year: number

  /**
   * @minimum 1
   * @maximum 52
   */
  weekNumber: number

  /**
   * Chaperone-specified geolocation limit center
   */
  geoLimitLatLng: LatLng

  /**
   * Chaperone-specified geolocation limit radius
   */
  geoLimitRadius: number
}
