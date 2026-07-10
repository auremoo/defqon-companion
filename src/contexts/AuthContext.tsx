import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  defqon_username: string | null
  is_dediqated: boolean
  dediqated_since: string | null  // ISO date YYYY-MM-DD
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  signUp: (email: string, password: string, username: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  updateProfile: (fields: Partial<Pick<Profile, 'display_name' | 'defqon_username' | 'is_dediqated' | 'dediqated_since'>>) => Promise<string | null>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: false,
  configured: false,
  signUp: async () => null,
  signIn: async () => null,
  signOut: async () => {},
  updateProfile: async () => null,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return

    // onAuthStateChanged résout depuis le cache IndexedDB — pas de blocage réseau
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function fetchProfile(uid: string) {
    if (!db) return
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      setProfile({ id: uid, ...(snap.data() as Omit<Profile, 'id'>) })
    }
  }

  async function signUp(email: string, password: string, username: string): Promise<string | null> {
    if (!auth || !db) return 'Firebase not configured'
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', newUser.uid), {
        username,
        display_name: username,
        defqon_username: null,
        is_dediqated: false,
        dediqated_since: null,
      })
      return null
    } catch (e: unknown) {
      return (e as Error).message
    }
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!auth) return 'Firebase not configured'
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return null
    } catch (e: unknown) {
      return (e as Error).message
    }
  }

  async function signOut() {
    if (!auth) return
    await firebaseSignOut(auth)
    setUser(null)
    setProfile(null)
  }

  async function updateProfile(fields: Partial<Pick<Profile, 'display_name' | 'defqon_username' | 'is_dediqated' | 'dediqated_since'>>): Promise<string | null> {
    if (!db || !user) return 'Not authenticated'
    try {
      await updateDoc(doc(db, 'users', user.uid), fields)
      await fetchProfile(user.uid)
      return null
    } catch (e: unknown) {
      return (e as Error).message
    }
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.uid)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, configured: isFirebaseConfigured, signUp, signIn, signOut, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
