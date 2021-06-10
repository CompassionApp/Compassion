import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

import { FirebaseConfig, DEFAULT_FIREBASE_CONFIG } from "./firebase-config"

/**
 * Manages all requests to the API.
 */
export class FirebaseApi {
  /**
   * Firebase App instance
   */
  app: firebase.app.App

  /**
   * The underlying firestore database instance
   */
  firestore: firebase.firestore.Firestore

  /**
   * Configurable options.
   */
  config: FirebaseConfig

  /**
   * Firebase authentication.
   */
  authentication: firebase.auth.Auth

  /**
   * Creates the Firestore
   *
   * @param config The configuration to use.
   */
  constructor(config: FirebaseConfig = DEFAULT_FIREBASE_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the Firestore.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // Check if already initialized before re-initializing. This will prevent an error from occurring during a hot reload.
    if (firebase.apps.length === 0) {
      this.app = firebase.initializeApp(this.config)
    }

    this.firestore = firebase.firestore(this.app)

    this.authentication = firebase.auth()
    // For reCAPTCHA/SMS verification:
    this.authentication.languageCode = "en"
  }
}
