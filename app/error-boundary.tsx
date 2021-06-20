import React from "react"
import { View } from "react-native"
import { FlexContainer, Text } from "./components"

interface State {
  hasError: boolean
}

interface Props {}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <FlexContainer column justifyCenter>
            <FlexContainer justifyCenter>
              <Text>Something went wrong.</Text>
            </FlexContainer>
          </FlexContainer>
        </View>
      )
    }

    return this.props.children
  }
}
