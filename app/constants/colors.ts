import { color } from "../theme"
import { RequestStatusEnum } from "../types"

/**
 * Maps a RequestStatusEnum to a color
 */
export const statusColorMap = new Map<RequestStatusEnum, string>([
  [RequestStatusEnum.CANCELED_BY_REQUESTER, color.palette.red],
  [RequestStatusEnum.REQUESTED, color.palette.grey2],
  [RequestStatusEnum.SCHEDULED, color.palette.blue],
  [RequestStatusEnum.REJECTED, color.palette.red],
])
