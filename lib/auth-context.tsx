"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        console.log("[v0] Initializing auth...")
        const supabase = createClient()
        console.log("[v0] Supabase client created, has auth:", !!supabase?.auth)

        if (!supabase?.auth) {
          throw new Error("Supabase client does not have auth module")
        }

        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (isMounted) {
          setUser(session?.user ?? null)
          console.log("[v0] Auth initialized, user:", session?.user?.email || "none")
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange?.((event, session) => {
          if (isMounted) {
            setUser(session?.user ?? null)
            console.log("[v0] Auth state changed, user:", session?.user?.email || "none")
          }
        }) || { data: { subscription: null } }

        return () => subscription?.unsubscribe()
      } catch (error: any) {
        console.error("[v0] Auth initialization error:", error)
        if (isMounted) {
          setError(error?.message || "Failed to initialize authentication")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    const unsubscribe = initializeAuth()

    return () => {
      isMounted = false
      unsubscribe?.then((unsub) => unsub?.())
    }
  }, [])

  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("[v0] Sign out error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, error, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
