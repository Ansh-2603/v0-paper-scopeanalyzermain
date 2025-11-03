"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onUpload: (files: File[]) => void
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      addFiles(Array.from(files))
    }
  }

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((f) =>
      [".pdf", ".png", ".jpg", ".jpeg", ".tiff"].some((ext) => f.name.toLowerCase().endsWith(ext)),
    )

    const fileNames = new Set(selectedFiles.map((f) => f.name))
    const uniqueFiles = validFiles.filter((f) => !fileNames.has(f.name))

    setSelectedFiles([...selectedFiles, ...uniqueFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    if (selectedFiles.length > 0) {
      try {
        // Convert files to base64
        const filesWithBase64 = await Promise.all(
          selectedFiles.map(
            (file) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                  const base64 = (reader.result as string).split(",")[1]
                  resolve({
                    name: file.name,
                    base64,
                    mimeType: file.type || "application/pdf",
                    file,
                  })
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
              }),
          ),
        )

        onUpload(filesWithBase64 as any)
        setSelectedFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ""
      } catch (error) {
        console.error("[v0] Error converting files:", error)
        alert("Error processing files. Please try again.")
      }
    }
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/2.5"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDragging ? "bg-primary/20" : "bg-muted"
            }`}
          >
            <FileUp className={`w-8 h-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground mb-1">Drop your documents here</p>
            <p className="text-sm text-muted-foreground">or click to browse. Supports PDF, PNG, JPG, TIFF</p>
          </div>

          <Button onClick={() => fileInputRef.current?.click()} className="mt-4">
            <Upload className="w-4 h-4 mr-2" />
            Select Files
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.png,.jpg,.jpeg,.tiff"
          multiple
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Selected Files ({selectedFiles.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileUp className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 p-1 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleAnalyze} className="flex-1">
                Analyze {selectedFiles.length} File{selectedFiles.length !== 1 ? "s" : ""}
              </Button>
              <Button variant="outline" onClick={() => setSelectedFiles([])}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-2xl font-bold text-primary">98%</p>
          <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-2xl font-bold text-primary">50+</p>
          <p className="text-xs text-muted-foreground mt-1">Languages</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-2xl font-bold text-primary">Instant</p>
          <p className="text-xs text-muted-foreground mt-1">Processing</p>
        </div>
      </div>
    </div>
  )
}
