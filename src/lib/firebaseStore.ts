// Lazy chunk — import through loadFirestore() in ./firebase, never statically.
// Components receive this module as `store` from useAuth(); `doc` and
// `collection` come pre-bound to the app's Firestore instance.
import {
  getFirestore,
  doc as firestoreDoc,
  collection as firestoreCollection,
} from 'firebase/firestore'
import { app } from './firebaseApp'

const db = getFirestore(app)

export const doc = (path: string, ...segments: string[]) => firestoreDoc(db, path, ...segments)
export const collection = (path: string) => firestoreCollection(db, path)

export {
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
