"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface HeroProps {
  onTryIt: () => void
}

export function Hero({ onTryIt }: HeroProps) {
  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-center mb-6">
          <FileText className="w-16 h-16 text-primary" />
        </div>

        <h1 className="text-5xl font-bold text-foreground text-balance">PaperScope</h1>

        <p className="text-xl text-muted-foreground text-balance">Analyze papers with precision and insight</p>

        <div className="flex gap-4 justify-center pt-8">
          <Button size="lg" onClick={onTryIt} className="bg-foreground text-background hover:bg-foreground/90">
            Try It
          </Button>
          <Button size="lg" variant="outline" onClick={() => (window.location.href = "/auth")}>
            Create Account
          </Button>
        </div>

        <div className="pt-8">
          <div className="w-12 h-8 mx-auto text-muted-foreground animate-bounce">↓</div>
        </div>
      </div>
    </section>
  )
}
