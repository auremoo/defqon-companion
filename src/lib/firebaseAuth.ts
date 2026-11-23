// Lazy chunk — import through loadAuth() in ./firebase, never statically.
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { app } from './firebaseApp'

// initializeAuth instead of getAuth: the app only uses email/password, so the
// popup/redirect resolver (a large part of the auth SDK) is left out of the bundle.
// The persistence list is getAuth's default, so existing sessions are kept.
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
})

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
