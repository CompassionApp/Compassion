export interface ProgressIndicatorProps {
  /**
   * Current step in progress
   */
  currentStep: number;
  /**
   * Total number of progress nodes to render
   */
  totalSteps: number;
}

export interface ProgressIndicatorItemViewProps {
  isFirstItem: boolean;
  isCompletedStep: boolean;
};
