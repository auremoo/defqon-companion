import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  username: string
  display_name: string | null
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  signUp: (email: string, password: string, username: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  configured: false,
  signUp: async () => null,
  signIn: async () => null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    if (!supabase) return
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  async function signUp(email: string, password: string, username: string): Promise<string | null> {
    if (!supabase) return 'Supabase not configured'
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } },
    })
    return error?.message ?? null
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!supabase) return 'Supabase not configured'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, configured: isSupabaseConfigured, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
