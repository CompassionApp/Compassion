import { FirebaseCoreApiAdapter } from "./firebase-core-api"
import firebase, { FirebaseError } from "firebase"
import type {
  AuthContext,
  CreateRequestResult,
  DeleteRequestResult,
  GetRequestsResult,
  UpdateRequestResult,
} from "./api.types"
import type { RequestSnapshot } from "../../models"
import { createBatchModifyRequest, typeConverter } from "./utils"
// import { typeConverter } from "./utils"

export class RequestApi {
  private firebase: FirebaseCoreApiAdapter

  constructor(firebase: FirebaseCoreApiAdapter) {
    this.firebase = firebase
  }

  /**
   * Subscribes to user's requests
   */
  subscribeToUserRequests(
    authContext: AuthContext,
    onSnapshot?: (requests: RequestSnapshot[]) => void,
  ) {
    // TODO: Bug. App crashes here when the user loses auth context
    if (!authContext?.email) {
      return undefined
    }

    console.log(`[request-api] Subscribing to user requests...`)
    return this.firebase.firestore
      .collection("users")
      .doc(authContext.email)
      .collection("requests")
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const requests: RequestSnapshot[] = []
        querySnapshot.forEach((doc) => {
          requests.push(doc.data() as RequestSnapshot)
        })
        onSnapshot(requests)
      })
  }

  /**
   * Subscribes to available requests
   */
  subscribeToAvailableRequests(onSnapshot?: (requests: RequestSnapshot[]) => void) {
    console.log(`[request-api] Subscribing to available requests...`)
    return this.firebase.firestore
      .collection("requests")
      .where("status", "==", "REQUESTED")
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const requests: RequestSnapshot[] = []
        querySnapshot.forEach((doc) => {
          requests.push(doc.data() as RequestSnapshot)
        })
        onSnapshot(requests)
      })
  }

  /**
   * Creates a new request by storing it under the `/users/[user-id]/requests/[id]` and `/requests/[id]` paths
   */
  async createRequest(
    request: RequestSnapshot,
    authContext: AuthContext,
  ): Promise<CreateRequestResult> {
    try {
      console.log(`Saving requestId:${request.id} to Firestore`)
      const { batch, requestsByIdRef, requestsByUserRef } = createBatchModifyRequest(
        this.firebase.firestore,
        request.id,
        authContext.email,
      )

      batch.set(requestsByIdRef, request)
      batch.set(requestsByUserRef, request)
      await batch.commit()
      console.log(
        `[request-api] Saved to "/requests/${request.id}" and "/users/${authContext.email}/requests/${request.id}"`,
      )
      return { kind: "ok" }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetches all the requests for the user by looking at the "/users/[user-id]/requests" path
   */
  async getUserRequests(authContext: AuthContext): Promise<GetRequestsResult> {
    try {
      console.log(`[request-api] Getting requests @ /user/${authContext.email}/requests/*`)
      const snapshot = await this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("requests")
        .withConverter(typeConverter<RequestSnapshot>())
        .get()

      const requests = snapshot.docs.map((doc) => (doc.data() as unknown) as RequestSnapshot)
      console.log(`[request-api] Found ${requests.length}`)
      return { kind: "ok", requests }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Fetches all the requests for the user by looking at the "/users/[user-id]/requests" path
   */
  async getAvailableRequests(): Promise<GetRequestsResult> {
    try {
      console.log(`[request-api] Getting available requests @ /requests/*`)
      const snapshot = await this.firebase.firestore
        .collection("requests")
        .withConverter(typeConverter<RequestSnapshot>())
        .where("status", "==", "REQUESTED")
        .get()

      const requests = snapshot.docs.map((doc) => (doc.data() as unknown) as RequestSnapshot)
      return { kind: "ok", requests }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Updates a request across all of its references
   */
  async updateRequest(
    requestId: string,
    partialRequestUpdate: Partial<RequestSnapshot>,
    authContext: AuthContext,
  ): Promise<DeleteRequestResult> {
    try {
      console.log(`[request-api] Changing status for ${requestId}...`)
      const requestsByIdRef = this.firebase.firestore.collection("requests").doc(requestId)
      const requestsByUserRef = this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("requests")
        .doc(requestId)

      this.firebase.firestore.runTransaction((transaction) => {
        return transaction.get(requestsByIdRef).then((request) => {
          if (!request.exists) {
            throw new Error("Request does not exist")
          }

          // Delete all the associated chaperones' docs
          const { chaperones } = request.data() as RequestSnapshot
          const chaperoneRequestRefs = chaperones.map((chaperone) => {
            return this.firebase.firestore
              .collection("users")
              .doc(chaperone.email)
              .collection("requests")
              .doc(requestId)
          })
          chaperoneRequestRefs.forEach((chaperoneRequestRefs) =>
            transaction.update(chaperoneRequestRefs, partialRequestUpdate),
          )
          transaction.update(requestsByIdRef, partialRequestUpdate)
          transaction.update(requestsByUserRef, partialRequestUpdate)
        })
      })

      return { kind: "ok" }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Accepts a request belonging to an arbitrary user as a chaperone
   */
  async acceptUserRequest(
    requestId: string,
    request: Partial<RequestSnapshot>,
    requesterId: string,
    authContext: AuthContext,
  ): Promise<UpdateRequestResult> {
    try {
      console.log(`[request-api] Accepting request ${requestId}...`, request)
      const { batch, requestsByIdRef, requestsByUserRef } = createBatchModifyRequest(
        this.firebase.firestore,
        requestId,
        requesterId,
      )
      const requestsByChaperoneRef = this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("requests")
        .doc(requestId)

      batch.update(requestsByIdRef, { ...request })
      batch.update(requestsByUserRef, { ...request })
      batch.set(requestsByChaperoneRef, { ...request })
      await batch.commit()

      return { kind: "ok" }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Releases a previously scheduled request. Opposite transaction to accepting a request.
   */
  async releaseUserRequest(
    requestId: string,
    request: Partial<RequestSnapshot>,
    requesterId: string,
    authContext: AuthContext,
  ): Promise<UpdateRequestResult> {
    try {
      console.log(`[request-api] Releasing request ${requestId}...`, request)
      const { batch, requestsByIdRef, requestsByUserRef } = createBatchModifyRequest(
        this.firebase.firestore,
        requestId,
        requesterId,
      )
      const requestsByChaperoneRef = this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("requests")
        .doc(requestId)

      batch.update(requestsByIdRef, { ...request })
      batch.update(requestsByUserRef, { ...request })
      batch.delete(requestsByChaperoneRef)
      await batch.commit()

      return { kind: "ok" }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Deletes a request for a user
   */
  async deleteRequest(requestId: string, authContext: AuthContext): Promise<DeleteRequestResult> {
    try {
      console.log(`[request-api] Deleting ${requestId} from Firestore...`)

      const requestsByIdRef = this.firebase.firestore.collection("requests").doc(requestId)
      const requestsByUserRef = this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("requests")
        .doc(requestId)

      this.firebase.firestore.runTransaction((transaction) => {
        return transaction
          .get(requestsByIdRef)
          .then((request) => {
            if (!request.exists) {
              throw new Error("Request does not exist")
            }

            // Delete all the associated chaperones' docs
            const { requestedBy, chaperones } = request.data() as RequestSnapshot
            const chaperoneRequestRefs = chaperones.map((chaperone) => {
              return this.firebase.firestore
                .collection("users")
                .doc(chaperone.email)
                .collection("requests")
                .doc(requestId)
            })

            const requestsByRequesterRef = this.firebase.firestore
              .collection("users")
              .doc(requestedBy.email)
              .collection("requests")
              .doc(requestId)

            chaperoneRequestRefs.forEach((chaperoneRequestRef) =>
              transaction.delete(chaperoneRequestRef),
            )

            transaction.get(requestsByRequesterRef).then((request) => {
              if (request.exists) {
                transaction.delete(requestsByRequesterRef)
              }
            })

            transaction.delete(requestsByIdRef)
            transaction.delete(requestsByUserRef)
          })
          .catch((e) => console.log("Error:", e.message))
      })

      return { kind: "ok" }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }
}
