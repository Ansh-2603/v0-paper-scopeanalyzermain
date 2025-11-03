import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Terms() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header showNav={true} />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">Last updated: November 2025</p>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
                <p>
                  By accessing and using PaperScope, you accept and agree to be bound by the terms of this agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">2. Use License</h2>
                <p>
                  Permission is granted to use PaperScope for personal, non-commercial purposes only. You may not
                  modify, copy, or reverse engineer any materials.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">3. Disclaimer</h2>
                <p>The materials on PaperScope are provided on an 'as is' basis without warranties of any kind.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">4. Contact</h2>
                <p>
                  For questions about these terms, contact us at{" "}
                  <a href="mailto:tech.project1288@gmail.com" className="text-primary font-semibold hover:underline">
                    tech.project1288@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
