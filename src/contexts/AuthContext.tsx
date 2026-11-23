import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { isFirebaseConfigured, loadAuth, loadFirestore, type FirestoreSdk } from '../lib/firebase'

// Set while a session is known to exist, so the next launch can fetch the
// Firestore chunk in parallel with auth instead of after it.
const SESSION_HINT_KEY = 'defqon-signed-in'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  defqon_username: string | null
  is_dediqated: boolean
  dediqated_since: string | null  // ISO date YYYY-MM-DD
}

type ProfileFields = Partial<Pick<Profile, 'display_name' | 'defqon_username' | 'is_dediqated' | 'dediqated_since'>>

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  /** Firestore SDK — null until a user is signed in (the chunk is loaded on demand). */
  store: FirestoreSdk | null
  signUp: (email: string, password: string, username: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  updateProfile: (fields: ProfileFields) => Promise<string | null>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: false,
  configured: false,
  store: null,
  signUp: async () => null,
  signIn: async () => null,
  signOut: async () => {},
  updateProfile: async () => null,
  refreshProfile: async () => {},
})

async function fetchProfile(fs: FirestoreSdk, uid: string): Promise<Profile | null> {
  const snap = await fs.getDoc(fs.doc('users', uid))
  return snap.exists() ? { id: uid, ...(snap.data() as Omit<Profile, 'id'>) } : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [store, setStore] = useState<FirestoreSdk | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return

    let cancelled = false
    let unsubscribe: (() => void) | undefined

    // Returning user: warm the Firestore chunk while auth resolves.
    if (localStorage.getItem(SESSION_HINT_KEY)) loadFirestore().catch(() => {})

    loadAuth()
      .then((sdk) => {
        if (cancelled) return
        // onAuthStateChanged resolves from the IndexedDB cache — no network block on startup
        unsubscribe = sdk.onAuthStateChanged(sdk.auth, async (firebaseUser) => {
          if (!firebaseUser) {
            localStorage.removeItem(SESSION_HINT_KEY)
            setUser(null)
            setProfile(null)
            setLoading(false)
            return
          }
          localStorage.setItem(SESSION_HINT_KEY, '1')
          try {
            const fs = await loadFirestore()
            if (cancelled) return
            setStore(fs)
            setUser(firebaseUser)
            const loaded = await fetchProfile(fs, firebaseUser.uid)
            if (!cancelled && loaded) setProfile(loaded)
          } catch {
            // Firestore unreachable: stay signed in, social data just won't sync
            if (!cancelled) setUser(firebaseUser)
          }
          if (!cancelled) setLoading(false)
        })
      })
      .catch(() => { if (!cancelled) setLoading(false) })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  async function signUp(email: string, password: string, username: string): Promise<string | null> {
    try {
      const [sdk, fs] = await Promise.all([loadAuth(), loadFirestore()])
      const { user: newUser } = await sdk.createUserWithEmailAndPassword(sdk.auth, email, password)
      const fields = {
        username,
        display_name: username,
        defqon_username: null,
        is_dediqated: false,
        dediqated_since: null,
      }
      await fs.setDoc(fs.doc('users', newUser.uid), fields)
      // onAuthStateChanged fires before this document exists, so its profile
      // read comes back empty — set the profile here instead.
      setProfile({ id: newUser.uid, ...fields })
      return null
    } catch (e: unknown) {
      return (e as Error).message
    }
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    try {
      const sdk = await loadAuth()
      await sdk.signInWithEmailAndPassword(sdk.auth, email, password)
      return null
    } catch (e: unknown) {
      return (e as Error).message
    }
  }

  async function signOut() {
    if (!isFirebaseConfigured) return
    const sdk = await loadAuth()
    await sdk.signOut(sdk.auth)
    setUser(null)
    setProfile(null)
  }

  async function updateProfile(fields: ProfileFields): Promise<string | null> {
    if (!store || !user) return 'Not authenticated'
    try {
      await store.updateDoc(store.doc('users', user.uid), fields)
      await refreshProfile()
      return null
    } catch (e: unknown) {
      return (e as Error).message
    }
  }

  async function refreshProfile() {
    if (!store || !user) return
    const loaded = await fetchProfile(store, user.uid)
    if (loaded) setProfile(loaded)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, configured: isFirebaseConfigured, store, signUp, signIn, signOut, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
