export enum TimeAmPmEnum {
  AM = "AM",
  PM = "PM",
}

/**
 * Converts a time to a linear value from 0-24, where fractionals represent minutes.
 *
 * 1:30 AM should yield 1.5, 11:45 PM should yield 23.75
 */
export const convert12to24Hour = (time: string): number => {
  const [hours, minutesAmPm] = time.split(":")
  if (!hours || !minutesAmPm) {
    return undefined
  }

  const [minutes] = minutesAmPm.split(" ")
  let value = Number(hours)
  value = value === 12 ? 0 : value
  if (time.endsWith(TimeAmPmEnum.PM)) value += 12
  value += Number(minutes) / 60
  return value
}

/**
 * Checks if the time provided is within the operating hours time range
 * @param time Time to evaluate
 * @param operatingHours Tuple of start and end "operating hours"
 */
export const isInOperatingHours = (time: string, operatingHours: [string, string]): boolean => {
  const [operatingHoursStart, operatingHoursEnd] = operatingHours
  // First, normalize the date strings to a 0-24 value
  const timeValue = convert12to24Hour(time)
  const operatingHoursStartValue = convert12to24Hour(operatingHoursStart)
  const operatingHoursEndValue = convert12to24Hour(operatingHoursEnd)

  if (!timeValue || !operatingHoursStartValue || !operatingHoursEndValue) {
    return undefined
  }

  // Evaluate
  if (timeValue >= operatingHoursStartValue && timeValue <= operatingHoursEndValue) {
    return true
  }
  return false
}
