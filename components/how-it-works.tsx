import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Upload, BarChart3, Clock, CheckCircle2 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "1. Upload Your Paper",
      description: "Simply upload your academic paper in PDF format or paste the text directly into PaperScope.",
    },
    {
      icon: Search,
      title: "2. AI Analysis",
      description:
        "Our AI engine analyzes the content, identifying key concepts, methodologies, findings, and conclusions",
    },
    {
      icon: BarChart3,
      title: "3. Interactive Results",
      description: "Receive a comprehensive breakdown of the paper with interactive visualizations and summaries.",
    },
    {
      icon: Clock,
      title: "4. Ask Questions",
      description: "Ask specific questions about the paper and get accurate, contextual answers based on the content",
    },
  ]

  const benefits = ["Save research time", "Improve comprehension", "Extract key information", "Multiple languages"]

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-3">How PaperScope Works</h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto text-balance">
            Our platform uses advanced AI to transform how you interact with academic papers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="border border-border">
                <CardHeader className="pb-3">
                  <div className="mb-2">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-muted-foreground text-xs text-balance">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-foreground text-xs">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
