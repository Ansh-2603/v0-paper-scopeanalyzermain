import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function About() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header showNav={true} />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">About PaperScope</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                PaperScope is an advanced academic paper analysis tool designed for researchers, students, and
                academics. Our mission is to help users quickly understand, extract, and analyze information from
                scholarly articles and research papers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that technology can transform how people interact with academic papers. By leveraging
                artificial intelligence and machine learning, we aim to make paper analysis faster, more intuitive, and
                accessible to everyone.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Key Features</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>AI-powered question analysis and categorization</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Support for multiple document formats (PDF, PNG, JPG, TIFF)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Real-time analysis using Gemini AI</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Persistent chat history for easy reference</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Secure authentication with Google OAuth</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Technology Stack</h2>
              <p className="text-muted-foreground leading-relaxed">
                PaperScope is built with Next.js, Supabase, and Google Gemini AI. We prioritize user privacy and data
                security.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
