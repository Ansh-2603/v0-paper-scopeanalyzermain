"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/file-upload"
import { BatchAnalysis } from "@/components/batch-analysis"
import { Header } from "@/components/header"
import { ChatSidebar } from "@/components/chat-sidebar"
import { useAuth } from "@/lib/auth-context"
import { saveChatHistory, loadChatHistory } from "@/app/actions/save-chat-history"

interface ChatSession {
  id: string
  name: string
  createdAt: string
  documentCount: number
  documents: any[]
  analysis: any
}

export default function AnalysisPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [viewMode, setViewMode] = useState<"app" | "batch">("app")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      loadUserChatHistory()
    } else {
      setLoadingHistory(false)
    }
  }, [user])

  const loadUserChatHistory = async () => {
    try {
      setLoadingHistory(true)
      const result = await loadChatHistory()
      if (result.success && result.data) {
        const sessions = result.data.map((item: any) => ({
          id: item.session_id,
          name: item.session_name,
          createdAt: item.created_at,
          documentCount: item.document_count,
          documents: [],
          analysis: item.analysis_data,
        }))
        setChatSessions(sessions)
      }
    } catch (err) {
      console.error("[v0] Error loading chat history:", err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFileUpload = async (filesWithBase64: any[]) => {
    const sessionId = Date.now().toString()
    const newSession: ChatSession = {
      id: sessionId,
      name: filesWithBase64.length > 1 ? `${filesWithBase64.length} Papers` : filesWithBase64[0].name,
      createdAt: new Date().toLocaleString(),
      documentCount: filesWithBase64.length,
      documents: filesWithBase64,
      analysis: null,
    }
    setChatSessions([newSession, ...chatSessions])
    setActiveSession(sessionId)
    setViewMode("batch")
  }

  const handleNewSession = () => {
    setViewMode("app")
    setActiveSession(null)
  }

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions(chatSessions.filter((s) => s.id !== sessionId))
    if (activeSession === sessionId) {
      setActiveSession(null)
      setViewMode("app")
    }
  }

  const handleSelectSession = (sessionId: string) => {
    setActiveSession(sessionId)
    setViewMode("batch")
  }

  const handleAnalysisComplete = async (analysis: any) => {
    const currentSession = chatSessions.find((s) => s.id === activeSession)
    if (currentSession && user) {
      await saveChatHistory({
        sessionId: currentSession.id,
        sessionName: currentSession.name,
        documentCount: currentSession.documentCount,
        analysisData: analysis,
      })
    }
  }

  const currentSession = chatSessions.find((s) => s.id === activeSession)

  if (authLoading || loadingHistory) {
    return (
      <main className="min-h-screen bg-background">
        <Header onTryIt={() => handleNewSession()} showNav={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onTryIt={() => handleNewSession()} showNav={true} />
      <div className="flex">
        {chatSessions.length > 0 && (
          <ChatSidebar
            sessions={chatSessions}
            activeSession={activeSession}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
          />
        )}

        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-12">
            {viewMode === "app" ? (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-foreground mb-3">Document Analysis</h1>
                  <p className="text-lg text-muted-foreground">Upload and analyze academic papers with AI</p>
                </div>
                <FileUpload onUpload={handleFileUpload} />
              </div>
            ) : currentSession ? (
              <BatchAnalysis
                documents={currentSession.documents}
                onBack={handleNewSession}
                onAnalysisComplete={handleAnalysisComplete}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
