import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let supabaseBrowserClient: any = null

/**
 * Create or return an existing Supabase client using @supabase/supabase-js
 * This automatically validates environment variables and prevents
 * multiple client instances in the browser.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("[v0] Missing Supabase environment variables")
    console.error("[v0] URL:", url ? "present" : "missing")
    console.error("[v0] Key:", key ? "present" : "missing")
    throw new Error("Supabase environment variables are not configured")
  }

  // Browser-side client with singleton pattern
  if (!supabaseBrowserClient) {
    try {
      supabaseBrowserClient = createSupabaseClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
      console.log("[v0] Supabase browser client initialized successfully with @supabase/supabase-js")
      console.log("[v0] Client has auth:", !!supabaseBrowserClient.auth)
    } catch (error) {
      console.error("[v0] Failed to create browser client:", error)
      throw error
    }
  }

  return supabaseBrowserClient
}

/**
 * Utility: Get a ready-to-use browser Supabase client.
 */
export const supabase = () => createClient()
