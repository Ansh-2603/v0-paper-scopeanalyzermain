"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function Feedback() {
  const [rating, setRating] = useState(5)
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ ...formData, rating })
    setFormData({ name: "", email: "", feedback: "" })
    setRating(5)
  }

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">We Value Your Feedback</h2>
          <p className="text-sm text-muted-foreground text-balance">
            Help us improve PaperScope by sharing your experience
          </p>
        </div>

        <Card className="border border-border">
          <CardContent className="pt-6 pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  How would you rate your experience?
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={num}
                        checked={rating === num}
                        onChange={() => setRating(num)}
                        className="w-3 h-3 text-primary"
                      />
                      <span className="ml-1 text-xs text-foreground">{num}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">1 = Poor, 5 = Excellent</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Your Feedback</label>
                <textarea
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-1.5 text-sm"
              >
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
