import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Privacy() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header showNav={true} />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">Last updated: November 2025</p>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">1. Data Encryption & Security</h2>
                <p>
                  Your information is encrypted both in transit (using TLS/SSL) and at rest in our Supabase database. We
                  implement industry-standard security measures.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">2. Data Collection</h2>
                <p>
                  We collect account information, documents you upload, feedback, and usage analytics. All data is
                  stored securely.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">3. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal data at any time by contacting us.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">4. Contact Us</h2>
                <p>
                  Questions? Email us at{" "}
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
