export interface PickupDropoffProps {
  /**
   * Total number of progress nodes to render
   */
  totalSteps: number
  setMarker
  pickupAddress
  dropoffAddress
  predictions
  getPredictions
}

export interface PickupDropoffItemViewProps {
  isFirstItem: boolean
}
