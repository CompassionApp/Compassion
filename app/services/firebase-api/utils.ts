/**
 * Converts a document into a known type
 */
export const typeConverter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => snap.data() as T,
})
