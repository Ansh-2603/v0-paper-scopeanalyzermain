"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface HeaderProps {
  onTryIt?: () => void
  showNav?: boolean
}

export function Header({ onTryIt, showNav }: HeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">PaperScope</h1>
        </Link>

        <div className="flex items-center gap-4">
          {showNav && (
            <>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost">Contact</Button>
              </Link>
            </>
          )}
          {!showNav && onTryIt && (
            <Button variant="outline" onClick={onTryIt}>
              Try It
            </Button>
          )}
          {user && (
            <Button variant="outline" onClick={async () => await signOut()}>
              Sign Out
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
