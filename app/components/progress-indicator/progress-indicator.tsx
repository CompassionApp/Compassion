import React from "react"
import { View, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"
import { ProgressIndicatorItemViewProps, ProgressIndicatorProps } from "./progress-indicator.props"

const PROGRESS_AREA_WRAPPER: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing[2],
  marginBottom: spacing[2],
}
const PROGRESS_BAR_STYLES_NOT_COMPLETED: ViewStyle = {
  flex: 1,
  height: 3,
  backgroundColor: color.palette.green,
}
const PROGRESS_DOT_STYLES_NOT_COMPLETED: ViewStyle = {
  borderRadius: 12,
  width: 12,
  height: 12,
  backgroundColor: color.palette.green,
}
const PROGRESS_BAR_STYLES_COMPLETED: ViewStyle = {
  ...PROGRESS_BAR_STYLES_NOT_COMPLETED,
  backgroundColor: color.palette.grey2,
}
const PROGRESS_DOT_STYLES_COMPLETED: ViewStyle = {
  ...PROGRESS_DOT_STYLES_NOT_COMPLETED,
  backgroundColor: null,
  borderWidth: 3,
  borderColor: color.palette.grey2,
}

const ProgressIndicator = ({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps): JSX.Element | null => {
  return (
    <View style={PROGRESS_AREA_WRAPPER}>
      {[...Array(totalSteps)].map((__, index) => (
        <ProgressIndicatorItemView
          key={index}
          isCompletedStep={index < currentStep}
          isFirstItem={index === 0}
        />
      ))}
    </View>
  )
}

const ProgressIndicatorItemView = ({
  isFirstItem,
  isCompletedStep,
}: ProgressIndicatorItemViewProps) => {
  return (
    <>
      {!isFirstItem && (
        <View
          style={
            isCompletedStep ? PROGRESS_BAR_STYLES_NOT_COMPLETED : PROGRESS_BAR_STYLES_COMPLETED
          }
        />
      )}
      <View
        style={isCompletedStep ? PROGRESS_DOT_STYLES_NOT_COMPLETED : PROGRESS_DOT_STYLES_COMPLETED}
      />
    </>
  )
}

export default ProgressIndicator
