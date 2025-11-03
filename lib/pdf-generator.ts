import jsPDF from "jspdf"
import "jspdf-autotable"

export async function generateAnalysisPDF(analysisData: any, documentNames: string[], sessionName: string) {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text("Question Paper Analysis Report", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    // Session info
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Session: ${sessionName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition)
    yPosition += 7
    doc.text(`Documents Analyzed: ${documentNames.join(", ")}`, 20, yPosition)
    yPosition += 15

    // Summary statistics
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Summary Statistics", 20, yPosition)
    yPosition += 10

    const importantCount = (analysisData.important || []).length
    const mediumCount = (analysisData.medium || []).length
    const easyCount = (analysisData.easy || []).length
    const importantMarks = (analysisData.important || []).reduce((sum: number, q: any) => sum + (q.marks || 0), 0)
    const mediumMarks = (analysisData.medium || []).reduce((sum: number, q: any) => sum + (q.marks || 0), 0)
    const easyMarks = (analysisData.easy || []).reduce((sum: number, q: any) => sum + (q.marks || 0), 0)
    const totalMarks = importantMarks + mediumMarks + easyMarks

    const summaryData = [
      ["Difficulty Level", "Count", "Marks"],
      ["Important", importantCount.toString(), importantMarks.toString()],
      ["Medium", mediumCount.toString(), mediumMarks.toString()],
      ["Easy", easyCount.toString(), easyMarks.toString()],
      ["TOTAL", (importantCount + mediumCount + easyCount).toString(), totalMarks.toString()],
    ]
    ;(doc as any).autoTable({
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: yPosition,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [66, 135, 245],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 50,
      },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Important Questions
    if (importantCount > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setTextColor(220, 53, 69)
      doc.text(`Important Questions (${importantCount})`, 20, yPosition)
      yPosition += 8

      const importantTableData = (analysisData.important || []).map((q: any) => [
        `${q.number}(${q.subPart})`,
        q.text.substring(0, 60) + (q.text.length > 60 ? "..." : ""),
        q.marks.toString(),
        q.reason.substring(0, 40) + (q.reason.length > 40 ? "..." : ""),
      ])
      ;(doc as any).autoTable({
        head: [["Q.No", "Question", "Marks", "Reason"]],
        body: importantTableData,
        startY: yPosition,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: 50,
        },
        headStyles: {
          fillColor: [220, 53, 69],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 60 },
          2: { cellWidth: 20 },
          3: { cellWidth: 50 },
        },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 10
    }

    // Medium Questions
    if (mediumCount > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setTextColor(255, 193, 7)
      doc.text(`Medium Questions (${mediumCount})`, 20, yPosition)
      yPosition += 8

      const mediumTableData = (analysisData.medium || []).map((q: any) => [
        `${q.number}(${q.subPart})`,
        q.text.substring(0, 60) + (q.text.length > 60 ? "..." : ""),
        q.marks.toString(),
        q.reason.substring(0, 40) + (q.reason.length > 40 ? "..." : ""),
      ])
      ;(doc as any).autoTable({
        head: [["Q.No", "Question", "Marks", "Reason"]],
        body: mediumTableData,
        startY: yPosition,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: 50,
        },
        headStyles: {
          fillColor: [255, 193, 7],
          textColor: 50,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 60 },
          2: { cellWidth: 20 },
          3: { cellWidth: 50 },
        },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 10
    }

    // Easy Questions
    if (easyCount > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setTextColor(40, 167, 69)
      doc.text(`Easy Questions (${easyCount})`, 20, yPosition)
      yPosition += 8

      const easyTableData = (analysisData.easy || []).map((q: any) => [
        `${q.number}(${q.subPart})`,
        q.text.substring(0, 60) + (q.text.length > 60 ? "..." : ""),
        q.marks.toString(),
        q.reason.substring(0, 40) + (q.reason.length > 40 ? "..." : ""),
      ])
      ;(doc as any).autoTable({
        head: [["Q.No", "Question", "Marks", "Reason"]],
        body: easyTableData,
        startY: yPosition,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: 50,
        },
        headStyles: {
          fillColor: [40, 167, 69],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 60 },
          2: { cellWidth: 20 },
          3: { cellWidth: 50 },
        },
      })
    }

    // Save PDF
    const fileName = `Analysis_${sessionName.replace(/\s+/g, "_")}_${Date.now()}.pdf`
    doc.save(fileName)

    return { success: true, fileName }
  } catch (error) {
    console.error("[v0] PDF generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate PDF",
    }
  }
}
