const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  useEmulator,
} = require("../../config/env")

/**
 * The options used to configure the API.
 */
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
  useEmulator: boolean
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  useEmulator,
}
