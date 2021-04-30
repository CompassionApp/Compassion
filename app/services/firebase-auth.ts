import { FirebaseApi } from "./firebase-api"
import { User } from "./api/api.types"
import { GetUserResult } from "./api/api.types"

export class FirebaseAuth {

    private firebase: FirebaseApi

    constructor(firebase: FirebaseApi) {
      this.firebase = firebase
    }

    async createUserWithEmailAndPassword(email: string, password: string): Promise<GetUserResult> {
        try {
            const userCredential = this.firebase.authentication.createUserWithEmailAndPassword(email, password)
            var user = (await userCredential).user
            return { kind: "ok", user: (user as unknown) as User}
          } catch (e) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
          }
    }

    async signInWithEmailAndPassword(email: string, password: string): Promise<GetUserResult> {
        try {
            const userCredential = this.firebase.authentication.signInWithEmailAndPassword(email, password)
            var user = (await userCredential).user
            return { kind: "ok", user: (user as unknown) as User}
          } catch (e) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
          }
    }

    /**
     * Sets an observer to the global authentication object which gets called whenever the user's sign in state changes.
     */
    async setAuthenticationStateObserver(user: User): Promise<GetUserResult> {
        try {
            this.firebase.authentication.onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    var uid = user.uid;
                } else {
                    // User is signed out
                }
            })
            return { kind: "ok", user: (user as unknown) as User}
          } catch (e) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
          }
    }

    async signOut() {
        try {
            this.firebase.authentication.signOut()
          } catch (e) {
            __DEV__ && console.tron.log(e.message)
          }
    }

}