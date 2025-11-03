interface ParsedQuestion {
  questionNumber: string
  subPart: string
  text: string
  marks: number
  fullQuestion: string
}

interface QuestionsAnalysis {
  questions: ParsedQuestion[]
  totalMarks: number
  byDifficulty: {
    important: ParsedQuestion[]
    medium: ParsedQuestion[]
    easy: ParsedQuestion[]
  }
}

export function parseQuestionPaper(text: string): QuestionsAnalysis {
  const lines = text.split("\n")
  const questions: ParsedQuestion[] = []

  let currentQuestion = ""
  let currentQNumber = ""
  const currentMarks = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Match question pattern: Q1, Q2, etc. or just 1, 2, etc.
    const qMatch = line.match(/^Q?(\d+)\s*\.?(.*)/)
    if (qMatch) {
      currentQNumber = qMatch[1]
      currentQuestion = qMatch[2]
      continue
    }

    // Match sub-parts: (a), (b), (c), (d)
    const subPartMatch = line.match(/^$$([a-d])$$\s*(.*)/)
    if (subPartMatch && currentQNumber) {
      const subPart = subPartMatch[1]
      const questionText = subPartMatch[2]

      // Look for marks in next few lines
      let marksFound = 0
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        const marksMatch = lines[j].match(/\[(\d+)\s*M\]|\[(\d+)\s*marks?\]|(\d+)\s*(?:marks?|M)$/i)
        if (marksMatch) {
          marksFound = Number.parseInt(marksMatch[1] || marksMatch[2] || marksMatch[3])
          break
        }
      }

      questions.push({
        questionNumber: currentQNumber,
        subPart,
        text: questionText,
        marks: marksFound || 5,
        fullQuestion: `Q${currentQNumber}(${subPart}): ${questionText}`,
      })
    }
  }

  // Categorize by difficulty based on marks
  const byDifficulty = {
    important: questions.filter((q) => q.marks >= 10),
    medium: questions.filter((q) => q.marks >= 5 && q.marks < 10),
    easy: questions.filter((q) => q.marks < 5),
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)

  return {
    questions,
    totalMarks,
    byDifficulty,
  }
}

export function categorizeByDifficulty(marks: number): "important" | "medium" | "easy" {
  if (marks >= 10) return "important"
  if (marks >= 5) return "medium"
  return "easy"
}
