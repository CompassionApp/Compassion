import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store
 */
export const ExampleStoreModel = types
  .model("ExampleStore")
  .props({})
  /** This is necessary to access the API instances */
  .extend(withEnvironment)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getDocument: async (userId: string) => {
      return self.environment.firebaseApi.firestore.collection("users").doc(userId)
    },
    getUser: async (userId: string) => {
      return self.environment.firebaseApi.firestore.collection("users").doc(userId).get()
    },
    /**
     *
     */
    saveUser: async (userId: string, payload: { userEmail: string; userPassword: string }) => {
      self.environment.firebaseApi.firestore.collection("users").doc(userId).set({
        email: payload.userEmail,
        password: payload.userPassword,
      })
    },
    createUser: async (userEmail: string, userPassword: string) => {
      return self.environment.firebaseApi.authentication.createUserWithEmailAndPassword(
        userEmail,
        userPassword,
      )
    },
    signIn: async (userEmail: string, userPassword: string) => {
      return self.environment.firebaseApi.authentication.signInWithEmailAndPassword(
        userEmail,
        userPassword,
      )
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type ExampleStoreType = Instance<typeof ExampleStoreModel>
export interface ExampleStore extends ExampleStoreType {}
type ExampleStoreSnapshotType = SnapshotOut<typeof ExampleStoreModel>
export interface ExampleStoreSnapshot extends ExampleStoreSnapshotType {}
export const createExampleStoreDefaultModel = () => types.optional(ExampleStoreModel, {})
