/* eslint-disable import/no-extraneous-dependencies */
import { Reactotron } from "reactotron-core-client"
import { ReactotronReactNative } from "reactotron-react-native"

/**
 * Add ambient type definitions here for modules without types
 */

declare module "ajv-formats" {
  let _default: any
  export default _default
}

declare module "jsonschema-to-mobx-state-tree" {
  let _default: any
  export default _default
}

declare global {
  interface Console {
    tron: Reactotron<ReactotronReactNative> & ReactotronReactNative
  }
}
