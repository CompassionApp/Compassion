import { format } from "date-fns"
import { generateUuid } from "./uuid"
import {
  NotificationSnapshot,
  NotificationTypeEnum,
  RequestSnapshot,
  UserProfileSnapshot,
} from "../models"
import { TIME_RANGE_FORMAT, TITLE_DATE_FORMAT } from "../constants"
import { translate, TxKeyPath } from "../i18n"

/** Formats the requestedAt date into a human-readable string */
function formatRequestedAt(requestedAt: string) {
  if (!requestedAt) {
    return ""
  }
  const formattedDate = format(new Date(requestedAt), TITLE_DATE_FORMAT)
  const formattedTime = format(new Date(requestedAt), TIME_RANGE_FORMAT)
  return requestedAt ? ` on ${formattedDate} at ${formattedTime}` : ""
}

/** Returns the first name and last initial */
function formatNameInitial(firstName: string, lastName: string) {
  return `${firstName} ${lastName.substr(0, 1)}.`
}

/**
 * Creates a "new request available" notification
 */
export const createNewRequestNotification = (
  requesterUserProfile: UserProfileSnapshot,
  request: RequestSnapshot,
): NotificationSnapshot => {
  return {
    id: generateUuid(),
    title: "New chaperone request available",
    subtitle: "",
    body: `${formatNameInitial(
      requesterUserProfile.firstName,
      requesterUserProfile.lastName,
    )} needs your help${formatRequestedAt(request.requestedAt)}!`,
    type: NotificationTypeEnum.NEW_REQUEST,
    data: {
      sentAt: new Date().toUTCString(),
      requestId: request.id,
      requestAt: request.requestedAt,
    },
  }
}

/**
 * Creates an "accepted request" notification
 */
export const createRequestAcceptedNotification = (
  chaperoneUserProfile: UserProfileSnapshot,
  request: RequestSnapshot,
): NotificationSnapshot => {
  return {
    id: generateUuid(),
    title: "Your request was matched!",
    subtitle: "",
    body: `${formatNameInitial(
      chaperoneUserProfile.firstName,
      chaperoneUserProfile.lastName,
    )} has accepted your request for ${translate(
      `enumRequestType.${request.type}` as TxKeyPath,
    )}${formatRequestedAt(request.requestedAt)}`,
    type: NotificationTypeEnum.REQUEST_MATCHED,
    data: {
      sentAt: new Date().toUTCString(),
      requestId: request.id,
      requestAt: request.requestedAt,
    },
  }
}

/**
 * Creates an "request canceled by requester" notification
 */
export const createRequestCanceledByRequesterNotification = (
  requesterUserProfile: UserProfileSnapshot,
  request: RequestSnapshot,
): NotificationSnapshot => {
  return {
    id: generateUuid(),
    title: "A scheduled request was canceled",
    subtitle: "",
    body: `${formatNameInitial(
      requesterUserProfile.firstName,
      requesterUserProfile.lastName,
    )} has canceled their request for ${translate(
      `enumRequestType.${request.type}` as TxKeyPath,
    )}${formatRequestedAt(request.requestedAt)}`,
    type: NotificationTypeEnum.REQUEST_CANCELED_BY_REQUESTER,
    data: {
      sentAt: new Date().toUTCString(),
      requestId: request.id,
      requestAt: request.requestedAt,
    },
  }
}

/**
 * Creates an "request canceled by chaperone" notification
 */
export const createRequestCanceledByChaperoneNotification = (
  chaperoneUserProfile: UserProfileSnapshot,
  request: RequestSnapshot,
): NotificationSnapshot => {
  return {
    id: generateUuid(),
    title: `Your request for ${translate(
      `enumRequestType.${request.type}` as TxKeyPath,
    )} was canceled`,
    subtitle: "",
    body: `Your chaperone ${formatNameInitial(
      chaperoneUserProfile.firstName,
      chaperoneUserProfile.lastName,
    )} canceled. Don't worry, we'll look find someone else!`,
    type: NotificationTypeEnum.REQUEST_CANCELED_BY_CHAPERONE,
    data: {
      sentAt: new Date().toUTCString(),
      requestId: request.id,
      requestAt: request.requestedAt,
    },
  }
}
