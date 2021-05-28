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
import { Request, RequestStatusEnum } from "../../types"
import { RequestSnapshot } from "../../models"

export class RequestApi {
  private firebase: FirebaseApi

  constructor(firebase: FirebaseApi) {
    this.firebase = firebase
  }

  /**
   * Creates a new request by storing it under the "/user" and "/request" collection
   */
  async createRequest(
    request: RequestSnapshot,
    authContext: AuthContext,
  ): Promise<CreateRequestResult> {
    try {
      console.log("Saving to firestore...", request)
      await this.firebase.firestore.collection("requests").doc(request.id).set(request)

      await this.firebase.firestore
        .collection("users")
        .doc(authContext.userId)
        .collection("requests")
        .doc(request.id)
        .set(request)

      console.log(`Saved to ${request.id}!`)
      return { kind: "ok", request }
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
      console.log(`Getting requests for ${authContext.userId}...`)
      const result = await this.firebase.firestore
        .collection("users")
        .doc(authContext.userId)
        .collection("requests")
        // .withConverter(typeConverter<Request>())
        .get()
      console.tron.log(result)

      return { kind: "ok", requests: (result as unknown) as Request[] }
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
      console.log(`Changing status for ${requestId}...`)
      await this.firebase.firestore.collection("requests").doc(requestId).update({
        status,
      })
      await this.firebase.firestore
        .collection("users")
        .doc(authContext.userId)
        .collection("requests")
        .doc(requestId)
        .update({
          status,
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
   * Deletes a request for a user
   */
  async deleteRequest(requestId: string, authContext: AuthContext): Promise<DeleteRequestResult> {
    try {
      console.log(`Deleting ${requestId} from Firestore...`)
      await this.firebase.firestore.collection("requests").doc(requestId).delete()
      await this.firebase.firestore
        .collection("users")
        .doc(authContext.userId)
        .collection("requests")
        .doc(requestId)
        .delete()

      return { kind: "ok" }
    } catch (e) {
      const error = <FirebaseError>e
      const { message } = error
      __DEV__ && console.tron.log(message)
      return { kind: "bad-data" }
    }
  }
}
