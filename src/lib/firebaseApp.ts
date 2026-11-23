// Lazy chunk — import through loadAuth() / loadFirestore() in ./firebase, never statically.
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebase'

export const app = initializeApp(firebaseConfig)
