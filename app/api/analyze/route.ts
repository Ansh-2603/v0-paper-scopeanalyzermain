import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyA3XO7raOC2dGYeQbU0UUb-APS9_tOZSOk"

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "GEMINI_API_KEY not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `You are an expert educator analyzing exam question papers from a teacher's perspective. Your task is to:

1. Extract ALL questions with their marks/weightage
2. Identify IMPORTANT QUESTIONS - Conceptually important, frequently tested, or core understanding (teacher's perspective)
3. Categorize questions into three levels based on conceptual importance
4. Track question repetition across all papers

Respond in this EXACT JSON format (pure JSON only, no markdown):
{
  "important": [
    {
      "number": "Q1",
      "subPart": "a",
      "text": "full question text",
      "marks": 8,
      "reason": "why this is important conceptually",
      "frequency": 2,
      "frequencyNotes": "appears in 2 papers, total 16 marks"
    }
  ],
  "medium": [
    {
      "number": "Q2",
      "subPart": "",
      "text": "full question text",
      "marks": 4,
      "reason": "moderate importance",
      "frequency": 1,
      "frequencyNotes": "appears once"
    }
  ],
  "easy": [
    {
      "number": "Q3",
      "subPart": "a",
      "text": "full question text",
      "marks": 2,
      "reason": "basic concept",
      "frequency": 1,
      "frequencyNotes": "appears once"
    }
  ]
}

Key Instructions:
- Extract ALL questions with exact marks
- Categorize based on conceptual importance (from a teacher's perspective)
- Track frequency: how many times similar questions appear
- Respond ONLY with valid JSON, nothing else`

    const allResults = {
      important: [],
      medium: [],
      easy: [],
    }

    for (const file of files) {
      try {
        let response
        let retries = 3

        while (retries > 0) {
          try {
            if (file.mimeType === "application/pdf") {
              response = await model.generateContent([
                prompt,
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: file.base64,
                  },
                },
              ])
            } else {
              // For images
              response = await model.generateContent([
                prompt,
                {
                  inlineData: {
                    mimeType: file.mimeType,
                    data: file.base64,
                  },
                },
              ])
            }
            break
          } catch (err: any) {
            if (err.message?.includes("429") || err.message?.includes("quota")) {
              retries--
              if (retries > 0) {
                console.log(`[v0] Rate limited, retrying in 3 seconds... (${retries} retries left)`)
                await new Promise((resolve) => setTimeout(resolve, 3000))
              } else {
                throw new Error("Quota exceeded after retries. Please try again later.")
              }
            } else {
              throw err
            }
          }
        }

        if (!response) {
          throw new Error("No response from API")
        }

        const responseText = response.response.text()
        console.log(`[v0] Gemini response for ${file.name} (first 500 chars):`, responseText.substring(0, 500))

        if (!responseText.trim() || !responseText.includes("{")) {
          console.error(`[v0] Invalid response from API for ${file.name}:`, responseText.substring(0, 200))
          return NextResponse.json(
            {
              success: false,
              error: `API returned invalid response. Your API key may be rate-limited or quota exceeded.`,
            },
            { status: 400 },
          )
        }

        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          console.log(`[v0] No JSON found in response for ${file.name}`)
          return NextResponse.json(
            { success: false, error: `Failed to parse AI response for ${file.name}.` },
            { status: 400 },
          )
        }

        const analysis = JSON.parse(jsonMatch[0])
        console.log(`[v0] Parsed analysis for ${file.name}:`, analysis)

        allResults.important.push(...(analysis.important || []))
        allResults.medium.push(...(analysis.medium || []))
        allResults.easy.push(...(analysis.easy || []))
      } catch (fileError: any) {
        console.error(`[v0] Error processing ${file.name}:`, fileError)
        return NextResponse.json(
          { success: false, error: `Error processing ${file.name}: ${fileError.message}` },
          { status: 400 },
        )
      }
    }

    console.log("[v0] Final results:", allResults)
    return NextResponse.json({
      success: true,
      data: allResults,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to analyze paper" },
      { status: 500 },
    )
  }
}
