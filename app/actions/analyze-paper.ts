async function compressPDF(base64: string): Promise<string> {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  // Use gzip compression (via pako library or simple compression)
  // For now, we'll use a simple approach: remove redundant streams
  const pdfText = new TextDecoder().decode(bytes)

  // Remove unnecessary whitespace and compression info
  let compressed = pdfText
    .replace(/\s+/g, " ") // Remove extra whitespace
    .replace(/\/Length\s+\d+/g, "/Length 1") // Minimize length declarations
    .replace(/stream\s+endstream/g, "stream\nendstream") // Normalize streams

  // If still too large, we can reduce image quality by removing images
  if (compressed.length * 1.33 > 3000000) {
    // Remove or downsize images
    compressed = compressed.replace(/\/XObject\s*<<[\s\S]*?>>/g, "")
  }

  return btoa(compressed)
}

export async function analyzePaperWithGemini(files: Array<{ name: string; base64: string; mimeType: string }>) {
  try {
    console.log("[v0] Starting paper analysis...")

    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const sizeInBytes = (file.base64.length * 3) / 4
        const sizeInMB = sizeInBytes / (1024 * 1024)

        if (file.mimeType === "application/pdf" && sizeInMB > 3) {
          console.log(`[v0] Compressing large PDF: ${file.name} (${sizeInMB.toFixed(1)}MB)`)
          try {
            const compressed = await compressPDF(file.base64)
            const compressedSizeInMB = (compressed.length * 3) / 4 / (1024 * 1024)
            console.log(`[v0] Compressed to ${compressedSizeInMB.toFixed(1)}MB`)
            return { ...file, base64: compressed }
          } catch (compressError) {
            console.warn(`[v0] Compression failed, using original:`, compressError)
            return file
          }
        }
        return file
      }),
    )

    const maxBaseSize = 1024 * 1024 * 3 // 3MB per file
    for (const file of compressedFiles) {
      const sizeInBytes = (file.base64.length * 3) / 4
      if (sizeInBytes > maxBaseSize) {
        throw new Error(
          `File "${file.name}" is still too large after compression (${(sizeInBytes / (1024 * 1024)).toFixed(1)}MB). Please try a different file.`,
        )
      }
    }

    const prompt = `You are an expert teacher analyzing one or more exam question papers. Analyze the given question paper(s) and categorize each question based on:
1. IMPORTANT QUESTIONS (10+ marks or frequently asked topics with high weightage)
2. MEDIUM QUESTIONS (5-9 marks or moderately important topics)
3. EASY QUESTIONS (1-4 marks or basic concepts)

Please analyze and respond in this exact JSON format (no markdown, just pure JSON):
{
  "important": [
    {"number": "Q1", "subPart": "a", "text": "question text here", "marks": 5, "reason": "why it's important"},
    {"number": "Q1", "subPart": "b", "text": "question text here", "marks": 5, "reason": "why it's important"}
  ],
  "medium": [
    {"number": "Q2", "subPart": "a", "text": "question text here", "marks": 3, "reason": "why it's medium"}
  ],
  "easy": [
    {"number": "Q3", "subPart": "a", "text": "question text here", "marks": 2, "reason": "why it's easy"}
  ]
}

Only respond with the JSON object, nothing else.`

    const allResults = {
      important: [],
      medium: [],
      easy: [],
    }

    for (let i = 0; i < compressedFiles.length; i++) {
      const file = compressedFiles[i]
      console.log(`[v0] Processing file ${i + 1}/${compressedFiles.length}: ${file.name}`)

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files: [file] }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to analyze papers")
        }

        const analysis = await response.json()

        // Merge results
        allResults.important.push(...(analysis.data.important || []))
        allResults.medium.push(...(analysis.data.medium || []))
        allResults.easy.push(...(analysis.data.easy || []))
      } catch (fileError: any) {
        console.error(`[v0] Error processing ${file.name}:`, fileError)
        throw fileError
      }
    }

    return {
      success: true,
      data: allResults,
      error: null,
    }
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to analyze paper",
    }
  }
}
