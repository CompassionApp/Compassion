import { color } from "../theme"
import { RequestStatusEnum } from "../types"

/**
 * Maps a RequestStatusEnum to a color
 */
export const statusColorMap = new Map<RequestStatusEnum, string>([
  [RequestStatusEnum.CANCELED_BY_REQUESTER, color.palette.red],
  [RequestStatusEnum.REQUESTED, color.palette.grey3],
  [RequestStatusEnum.SCHEDULED, color.palette.green],
  [RequestStatusEnum.REJECTED, color.palette.red],
])
