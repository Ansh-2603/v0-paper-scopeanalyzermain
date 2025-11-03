"use client"
import { FileText, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Document {
  id: number
  name: string
  uploadedAt: string
  status: string
}

interface RecentDocumentsProps {
  documents: Document[]
  onSelectDoc: (doc: Document) => void
  onAnalyze: (doc: Document) => void
}

export function RecentDocuments({ documents, onSelectDoc, onAnalyze }: RecentDocumentsProps) {
  const [analyzingId, setAnalyzingId] = useState<number | null>(null)

  const handleAnalyze = async (doc: Document) => {
    setAnalyzingId(doc.id)
    onAnalyze(doc)
    // Analysis happens in parent, analyzing flag will be cleared there
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">Recent Documents</h2>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{doc.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {doc.uploadedAt}
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-600 rounded text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Ready to Analyze
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleAnalyze(doc)}
                disabled={analyzingId === doc.id}
                className="whitespace-nowrap"
              >
                {analyzingId === doc.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
