import firebase from "firebase"

/**
 * Converts a document into a known type
 */
export const typeConverter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => snap.data() as T,
})

/**
 * Creates a batch for updating a single request to multiple paths: `/users/[user-id]/requests/[request-id]` and
 * `/requests/[request-id]`
 *
 * Helper function since this is a common operation
 */
export const createBatchModifyRequest = (
  firestore: firebase.firestore.Firestore,
  requestId: string,
  userId: string,
) => {
  const batch = firestore.batch()
  const requestsByIdRef = firestore.collection("requests").doc(requestId)
  const requestsByUserRef = firestore
    .collection("users")
    .doc(userId)
    .collection("requests")
    .doc(requestId)

  return {
    batch,
    requestsByIdRef,
    requestsByUserRef,
  }
}
