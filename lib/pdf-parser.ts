import * as pdfjsLib from "pdfjs-dist"

// Set up the worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ""

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n"
    }

    return fullText
  } catch (error) {
    console.error("[v0] PDF extraction error:", error)
    throw new Error("Failed to extract text from PDF")
  }
}

export async function extractTextFromFiles(files: File[]): Promise<string> {
  try {
    let allText = ""

    for (const file of files) {
      if (file.type === "application/pdf") {
        const text = await extractTextFromPDF(file)
        allText += `\n\n--- ${file.name} ---\n${text}`
      } else if (file.type.startsWith("image/")) {
        // For images, we'll use basic OCR or placeholder
        allText += `\n\n--- ${file.name} (Image - OCR not yet implemented) ---\n`
      }
    }

    return allText
  } catch (error) {
    console.error("[v0] Text extraction error:", error)
    throw error
  }
}
