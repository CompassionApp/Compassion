import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAF20lDkGOMuHmVKn8wanXb8TMP9gGZYGM",
  authDomain: "compassionapp-5b812.firebaseapp.com",
  projectId: "compassionapp-5b812",
  storageBucket: "compassionapp-5b812.appspot.com",
  messagingSenderId: "1038663598820",
  appId: "1:1038663598820:web:6c26dbef658a736f6ea2f1",
  measurementId: "G-X9C6HY4ETC"
}
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
export default db

// these should be safe to expose for now
// https://firebase.google.com/docs/projects/api-keys
