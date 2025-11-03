"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DocumentPreviewProps {
  document: any
  onBack: () => void
}

export function DocumentPreview({ document, onBack }: DocumentPreviewProps) {
  const [copied, setCopied] = useState(false)

  const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{document.name}</h1>
          <p className="text-sm text-muted-foreground">Uploaded {document.uploadedAt}</p>
        </div>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="text">Extracted Text</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-foreground">Document Content</h3>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{sampleText}</p>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export as TXT
            </Button>
            <Button className="flex-1">Export as PDF</Button>
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="font-semibold text-foreground">{document.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">File Type</p>
              <p className="font-semibold text-foreground">{document.type || "Document"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uploaded Date</p>
              <p className="font-semibold text-foreground">{document.uploadedAt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processing Status</p>
              <p className="font-semibold text-green-600">Completed</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }}></div>
              </div>
              <p className="font-semibold text-foreground mt-1">94%</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
