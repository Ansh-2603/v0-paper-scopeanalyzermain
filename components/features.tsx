import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      title: "For Researchers",
      description: "Accelerate your research by quickly extracting key information from papers.",
    },
    {
      title: "For Students",
      description: "Better understand complex academic papers for your studies.",
    },
    {
      title: "For Academics",
      description: "Stay up-to-date with research by processing more papers in less time.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">What PaperScope Is</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            PaperScope is an advanced academic paper analysis tool designed for researchers, students, and academics. It
            leverages artificial intelligence to help users quickly understand, extract, and analyze information from
            scholarly articles and research papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border border-border">
              <CardHeader>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-balance">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
