// Server action to save analysis to Supabase
"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function saveAnalysisToSupabase(analysisData: any, userId: string, fileName: string) {
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

    // Save analysis to database
    const { data, error } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        file_name: fileName,
        analysis_data: analysisData,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("[v0] Save analysis error:", err)
    return { success: false, error: err.message }
  }
}
