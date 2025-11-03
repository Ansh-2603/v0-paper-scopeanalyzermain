"use client"

import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ChatSession {
  id: string
  name: string
  createdAt: string
  documentCount: number
}

interface ChatSidebarProps {
  sessions: ChatSession[]
  activeSession: string | null
  onSelectSession: (sessionId: string) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
}

export function ChatSidebar({
  sessions,
  activeSession,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: ChatSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Button onClick={onNewSession} className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sessions.length === 0 ? (
          <p className="text-xs text-sidebar-foreground/50 text-center py-4">
            No analysis sessions yet. Upload a paper to get started.
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectSession(session.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                activeSession === session.id ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              }`}
            >
              <h3 className="text-sm font-medium text-sidebar-foreground truncate">{session.name}</h3>
              <p className="text-xs text-sidebar-foreground/60 mt-1">
                {session.documentCount} document{session.documentCount !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-sidebar-foreground/50 mt-0.5">{session.createdAt}</p>
              {hoveredId === session.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(session.id)
                  }}
                  className="mt-2 w-full text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
