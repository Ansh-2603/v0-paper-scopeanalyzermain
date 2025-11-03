"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function submitFeedback(formData: {
  name: string
  email: string
  rating: number
  message: string
}) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Handle errors silently
            }
          },
        },
      },
    )

    const { data, error } = await supabase
      .from("feedback")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          rating: Number.parseInt(formData.rating.toString()),
          message: formData.message,
        },
      ])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to submit feedback" }
  }
}
