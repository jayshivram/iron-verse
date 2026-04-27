import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseReady } from '@/services/supabase'
import { authService } from '@/services/auth.service'
import type { Profile } from '@/types/database.types'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    const p = await authService.getProfile(userId)
    setProfile(p)
  }, [])

  useEffect(() => {
    // Skip all Supabase auth calls when running in static mode
    if (!isSupabaseReady) {
      setIsLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    }).catch(() => setIsLoading(false))

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        await loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [loadProfile])

  const signIn = async (email: string, password: string) => {
    await authService.signIn({ email, password })
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    await authService.signUp({ email, password, fullName })
  }

  const signOut = async () => {
    await authService.signOut()
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return
    const updated = await authService.updateProfile(user.id, updates)
    setProfile(updated)
  }

  const refreshProfile = async () => {
    if (!user) return
    await loadProfile(user.id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAdmin: profile?.is_admin ?? false,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
