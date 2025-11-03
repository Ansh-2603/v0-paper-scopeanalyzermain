"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [message, setMessage] = useState("Completing sign in…")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      console.log("[v0] User detected:", user.email)
      setMessage("Sign in successful! Redirecting...")
      router.replace("/app")
    }
  }, [user, router])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        console.error("[v0] Timeout: No user detected after 5 seconds")
        setError("Authentication timeout. Please try again.")
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [user])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">PaperScope</h1>
        {error ? (
          <>
            <p className="text-destructive text-sm max-w-xs">{error}</p>
            <button onClick={() => (window.location.href = "/auth")} className="text-sm text-primary hover:underline">
              Back to login
            </button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">{message}</p>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
