import { FirebaseApi } from "./firebase-api"
import { FirebaseError } from "firebase"
import {
  AuthContext,
  CreateRequestResult,
  DeleteRequestResult,
  GetRequestsResult,
} from "./api.types"
// import { User } from "../api/api.types"
// import { typeConverter } from "./utils"
import { RequestStatusEnum } from "../../types"
import { RequestSnapshot } from "../../models"
import { createBatchModifyRequest, typeConverter } from "./utils"

export class RequestApi {
  private firebase: FirebaseApi

  constructor(firebase: FirebaseApi) {
    this.firebase = firebase
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
  async getRequests(authContext: AuthContext): Promise<GetRequestsResult> {
    try {
      console.log(`[request-api] Getting requests @ /user/${authContext.email}/requests/*`)
      const snapshot = await this.firebase.firestore
        .collection("users")
        .doc(authContext.email)
        .collection("requests")
        .withConverter(typeConverter<RequestSnapshot>())
        .get()

      const requests = snapshot.docs.map((doc) => (doc.data() as unknown) as RequestSnapshot)
      console.log("From firebase:", requests)
      return { kind: "ok", requests }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }

  /**
   * Changes a request's status
   */
  async changeRequestStatus(
    requestId: string,
    status: RequestStatusEnum,
    authContext: AuthContext,
  ): Promise<DeleteRequestResult> {
    try {
      console.log(`[request-api] Changing status for ${requestId}...`)
      const { batch, requestsByIdRef, requestsByUserRef } = createBatchModifyRequest(
        this.firebase.firestore,
        requestId,
        authContext.email,
      )

      batch.update(requestsByIdRef, { status })
      batch.update(requestsByUserRef, { status })
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

      const { batch, requestsByIdRef, requestsByUserRef } = createBatchModifyRequest(
        this.firebase.firestore,
        requestId,
        authContext.email,
      )

      batch.delete(requestsByIdRef)
      batch.delete(requestsByUserRef)
      await batch.commit()
      return { kind: "ok" }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }
}
