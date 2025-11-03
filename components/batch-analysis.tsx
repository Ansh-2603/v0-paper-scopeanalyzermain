"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyzePaperWithGemini } from "@/app/actions/analyze-paper"
import { useAuth } from "@/lib/auth-context"
import { generateAnalysisPDF } from "@/lib/pdf-generator"

interface BatchAnalysisProps {
  documents: any[]
  onBack: () => void
  onDownload?: () => void
  onAnalysisComplete?: (analysis: any) => void
}

export function BatchAnalysis({ documents, onBack, onDownload, onAnalysisComplete }: BatchAnalysisProps) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const analyzePapers = async () => {
      try {
        setLoading(true)
        setError(null)

        const files = documents.map((doc: any) => ({
          name: doc.name,
          base64: doc.base64,
          mimeType: doc.mimeType,
        }))

        if (!files || files.length === 0) {
          throw new Error("No documents available for analysis")
        }

        const result = await analyzePaperWithGemini(files)

        if (result.success) {
          setAnalysisData(result.data)
          onAnalysisComplete?.(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        console.error("[v0] Analysis error:", err)
        setError(err instanceof Error ? err.message : "Failed to analyze papers")
      } finally {
        setLoading(false)
      }
    }

    analyzePapers()
  }, [documents, onAnalysisComplete])

  const handleDownloadPDF = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    try {
      setDownloading(true)
      const documentNames = documents.map((doc: any) => doc.name)
      const sessionName = documentNames.length > 1 ? `${documentNames.length} Papers` : documentNames[0]

      await generateAnalysisPDF(analysisData, documentNames, sessionName)
    } catch (err) {
      console.error("[v0] Download error:", err)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(analysisData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
          <p className="text-muted-foreground">Analyzing your papers with AI...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-4">Analysis Error</p>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={onBack} variant="outline">
            ← Back
          </Button>
        </div>
      </div>
    )
  }

  if (
    !analysisData ||
    (analysisData.important?.length === 0 && analysisData.medium?.length === 0 && analysisData.easy?.length === 0)
  ) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground mb-6">
            No questions were found in the analysis. Please check your PDF files and try again.
          </p>
          <Button onClick={onBack} variant="outline">
            ← Back
          </Button>
        </div>
      </div>
    )
  }

  const importantMarks = (analysisData.important || []).reduce((sum: number, q: any) => sum + (q.marks || 0), 0) || 0
  const mediumMarks = (analysisData.medium || []).reduce((sum: number, q: any) => sum + (q.marks || 0), 0) || 0
  const easyMarks = (analysisData.easy || []).reduce((sum: number, q: any) => sum + (q.marks || 0), 0) || 0
  const totalMarks = importantMarks + mediumMarks + easyMarks

  return (
    <div className="space-y-6">
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-foreground mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">Please login to download your analysis as PDF</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowLoginPrompt(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => (window.location.href = "/auth")}>
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Question Paper Analysis</h1>
          <p className="text-sm text-muted-foreground">{documents.length} papers analyzed by Gemini AI</p>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full max-w-4xl grid-cols-2">
          <TabsTrigger value="analysis">Question Analysis</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Important</h3>
              <p className="text-2xl font-bold text-red-700">{(analysisData.important || []).length}</p>
              <p className="text-sm text-red-600">{importantMarks} marks</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">Medium</h3>
              <p className="text-2xl font-bold text-amber-700">{(analysisData.medium || []).length}</p>
              <p className="text-sm text-amber-600">{mediumMarks} marks</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Easy</h3>
              <p className="text-2xl font-bold text-green-700">{(analysisData.easy || []).length}</p>
              <p className="text-sm text-green-600">{easyMarks} marks</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Total Marks:</span> {totalMarks}
            </p>
          </div>

          {(analysisData.important || []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-foreground">
                Important Questions ({(analysisData.important || []).length})
              </h3>
              <div className="space-y-3">
                {(analysisData.important || []).map((q: any, idx: number) => (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-red-900">
                            {q.number}
                            {q.subPart ? `(${q.subPart})` : ""}
                          </p>
                          {q.frequency && q.frequency > 1 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-red-200 text-red-900">
                              Repeated {q.frequency}x
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-red-800 mt-2">{q.text}</p>
                        <p className="text-xs text-red-600 mt-2 italic">{q.reason}</p>
                        {q.frequencyNotes && <p className="text-xs text-red-500 mt-1">{q.frequencyNotes}</p>}
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded whitespace-nowrap bg-red-100 text-red-800">
                        {q.marks}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(analysisData.medium || []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-foreground">
                Medium Questions ({(analysisData.medium || []).length})
              </h3>
              <div className="space-y-3">
                {(analysisData.medium || []).map((q: any, idx: number) => (
                  <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-amber-900">
                            {q.number}
                            {q.subPart ? `(${q.subPart})` : ""}
                          </p>
                          {q.frequency && q.frequency > 1 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-amber-200 text-amber-900">
                              Repeated {q.frequency}x
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-amber-800 mt-2">{q.text}</p>
                        <p className="text-xs text-amber-600 mt-1 italic">{q.reason}</p>
                        {q.frequencyNotes && <p className="text-xs text-amber-500 mt-1">{q.frequencyNotes}</p>}
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded whitespace-nowrap bg-amber-100 text-amber-800">
                        {q.marks}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(analysisData.easy || []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-foreground">
                Easy Questions ({(analysisData.easy || []).length})
              </h3>
              <div className="space-y-3">
                {(analysisData.easy || []).map((q: any, idx: number) => (
                  <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-green-900">
                            {q.number}
                            {q.subPart ? `(${q.subPart})` : ""}
                          </p>
                          {q.frequency && q.frequency > 1 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-green-200 text-green-900">
                              Repeated {q.frequency}x
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-green-800 mt-2">{q.text}</p>
                        <p className="text-xs text-green-600 mt-1 italic">{q.reason}</p>
                        {q.frequencyNotes && <p className="text-xs text-green-500 mt-1">{q.frequencyNotes}</p>}
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded whitespace-nowrap bg-green-100 text-green-800">
                        {q.marks}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleDownloadPDF} disabled={downloading} className="flex-1">
              {downloading ? "Generating PDF..." : `Download PDF${!user ? " (Login Required)" : ""}`}
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Analysis"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Raw AI Analysis Data</h3>
            <pre className="bg-muted p-4 rounded overflow-auto max-h-96 text-xs text-foreground">
              {JSON.stringify(analysisData, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
