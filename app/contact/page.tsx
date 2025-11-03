import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail } from "lucide-react"

export default function Contact() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header showNav={true} />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Email Support</h3>
                  <a href="mailto:tech.project1288@gmail.com" className="text-primary hover:underline">
                    tech.project1288@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
