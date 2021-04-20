import { FirebaseApi } from "./firebase-api"
import { GetUserResult } from "./api.types"
import { User } from "../api/api.types"
import { typeConverter } from "./utils"

export class UserApi {
  private firebase: FirebaseApi

  constructor(firebase: FirebaseApi) {
    this.firebase = firebase
  }

  async getUser(id: string): Promise<GetUserResult> {
    try {
      const result = await this.firebase.firestore
        .collection("users")
        .withConverter(typeConverter<User>())
        .doc(id)
        .get()

      return { kind: "ok", user: (result as unknown) as User }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getUsers(id: string): Promise<GetUserResult> {
    try {
      const result = await this.firebase.firestore
        .collection("users")
        .withConverter(typeConverter<User>())
        .doc(id)
        .get()

      return { kind: "ok", user: (result as unknown) as User }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
