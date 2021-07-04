/**
 * Helpers for managing Firestore subscriptions in our MST stores
 */

/** Full enum list of all subscription types. Before adding a new subscription, put an entry here */
export enum SubscriptionTypeEnum {
  USER_REQUESTS = "USER_REQUESTS",
  AVAILABLE_REQUESTS = "AVAILABLE_REQUESTS",
  USER_NOTIFICATIONS = "USER_NOTIFICATIONS",
}

export type UnsubscribeFn = () => void
export type SubscriptionMap = Map<SubscriptionTypeEnum, UnsubscribeFn>

/** Factory function to create a subscription map of the subscription type to an unsubscribe
 * function for that subscription */
const createSubscriptionMap = (
  initial?: [SubscriptionTypeEnum, UnsubscribeFn][],
): SubscriptionMap => new Map<SubscriptionTypeEnum, UnsubscribeFn>(initial)

export class SubscriptionManager {
  subscriptionMap: SubscriptionMap

  get size() {
    return this.subscriptionMap.size
  }

  constructor(initial?: [SubscriptionTypeEnum, UnsubscribeFn][]) {
    this.subscriptionMap = createSubscriptionMap(initial)
  }

  /** Registers a subscription to the map provided */
  registerSubscription(type: SubscriptionTypeEnum, unsubscribeFn: UnsubscribeFn) {
    this.subscriptionMap.set(type, unsubscribeFn)
  }

  /** Unsubscribes to a specific subscription type */
  unsubscribeByType(type: SubscriptionTypeEnum) {
    const unsubscribeFn = this.subscriptionMap.get(type)
    if (!unsubscribeFn) {
      throw new Error(`Attempted to unsubscribe to ${type} which is not active`)
    }
    unsubscribeFn()
    this.subscriptionMap.delete(type)
  }

  /** Unsubscribes to a specific subscription type safely (doesn't throw an exception if the
   * subscription isn't active or valid) */
  safeUnsubscribeByType(type: SubscriptionTypeEnum) {
    const unsubscribeFn = this.subscriptionMap.get(type)
    if (unsubscribeFn && typeof unsubscribeFn === "function") {
      unsubscribeFn()
      this.subscriptionMap.delete(type)
    }
  }

  /** Unsubscribes to all subscriptions in the map */
  unsubscribeAll(onUnsubscribe?: (type: SubscriptionTypeEnum) => void) {
    for (const [type, unsubscribeFn] of this.subscriptionMap.entries()) {
      if (!unsubscribeFn || typeof unsubscribeFn !== "function") {
        throw new Error(`Attempting to unsubscribe ${type} with an invalid unsubscribe function`)
      }
      unsubscribeFn()
      this.subscriptionMap.delete(type)
      onUnsubscribe && onUnsubscribe(type)
    }
  }
}
