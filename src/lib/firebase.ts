// Lightweight Firebase entry point: only the config check lives in the main
// bundle. The SDK itself is split into two lazy chunks so it never blocks the
// first paint:
//   - auth      (firebase/app + firebase/auth)  → loaded once the app has rendered
//   - firestore (firebase/firestore)            → loaded only for signed-in users

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

export type AuthSdk = typeof import('./firebaseAuth')
export type FirestoreSdk = typeof import('./firebaseStore')

let authPromise: Promise<AuthSdk> | undefined
let storePromise: Promise<FirestoreSdk> | undefined

/** Loads firebase/auth on first call. Rejects when Firebase is not configured. */
export function loadAuth(): Promise<AuthSdk> {
  if (!isFirebaseConfigured) return Promise.reject(new Error('Firebase not configured'))
  authPromise ??= import('./firebaseAuth').catch((e) => {
    authPromise = undefined // allow a retry after a failed chunk load
    throw e
  })
  return authPromise
}

/** Loads firebase/firestore on first call. Rejects when Firebase is not configured. */
export function loadFirestore(): Promise<FirestoreSdk> {
  if (!isFirebaseConfigured) return Promise.reject(new Error('Firebase not configured'))
  storePromise ??= import('./firebaseStore').catch((e) => {
    storePromise = undefined
    throw e
  })
  return storePromise
}
