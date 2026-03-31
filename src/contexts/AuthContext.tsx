import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  defqon_username: string | null
  is_dediqated: boolean
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  signUp: (email: string, password: string, username: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  updateProfile: (fields: Partial<Pick<Profile, 'display_name' | 'defqon_username' | 'is_dediqated'>>) => Promise<string | null>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
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
      .select('id, username, display_name, defqon_username, is_dediqated')
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

  async function updateProfile(fields: Partial<Pick<Profile, 'display_name' | 'defqon_username' | 'is_dediqated'>>): Promise<string | null> {
    if (!supabase || !user) return 'Not authenticated'
    const { error } = await supabase.from('profiles').update(fields).eq('id', user.id)
    if (error) return error.message
    await fetchProfile(user.id)
    return null
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, configured: isSupabaseConfigured, signUp, signIn, signOut, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
