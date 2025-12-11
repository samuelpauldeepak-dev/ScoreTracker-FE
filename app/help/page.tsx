"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  HelpCircle,
  Keyboard,
  BookOpen,
  MessageCircle,
  Mail,
  ExternalLink,
  Search,
  Plus,
  BarChart3,
  Calendar,
  FileText,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [feedbackForm, setFeedbackForm] = useState({
    subject: "",
    message: "",
  })

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock feedback submission
    toast.success("Feedback submitted successfully! We'll get back to you soon.")
    setFeedbackForm({ subject: "", message: "" })
  }

  const shortcuts = [
    { key: "Ctrl/Cmd + D", action: "Go to Dashboard" },
    { key: "Ctrl/Cmd + T", action: "Go to Tests" },
    { key: "Ctrl/Cmd + A", action: "Go to Analytics" },
    { key: "Ctrl/Cmd + S", action: "Go to Subjects" },
    { key: "Ctrl/Cmd + C", action: "Go to Calendar" },
    { key: "Ctrl/Cmd + R", action: "Go to Reports" },
    { key: "Ctrl/Cmd + ,", action: "Go to Settings" },
    { key: "Esc", action: "Close modals/dialogs" },
  ]

  const faqs = [
    {
      question: "How do I add a new test?",
      answer:
        'Go to the Tests page and click the "Add Test" button. Fill in the test details including name, subject, score, and date.',
    },
    {
      question: "Can I import test data from a spreadsheet?",
      answer:
        'Yes! On the Tests page, click "Import Tests" and upload a CSV file with your test data. Make sure to follow the template format.',
    },
    {
      question: "How are my analytics calculated?",
      answer:
        "Analytics are calculated based on your test scores, subjects, and performance over time. The system tracks trends, averages, and identifies weak areas automatically.",
    },
    {
      question: "Is my data saved automatically?",
      answer:
        "Yes, all your data is automatically saved to your browser's local storage. You can also export your data from the Settings page for backup.",
    },
    {
      question: "How do I set study goals?",
      answer:
        "Visit the Calendar page to set study goals and track your progress. You can create goals for scores, test counts, or subject completion.",
    },
    {
      question: "Can I use this app offline?",
      answer:
        "The app works offline once loaded. Your data is stored locally, so you can continue using it without an internet connection.",
    },
  ]

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with ScoreTracker and learn how to make the most of your study tracking.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium">Add Tests</h4>
                <p className="text-sm text-muted-foreground">Learn to add and manage your test scores</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium">View Analytics</h4>
                <p className="text-sm text-muted-foreground">Understand your performance metrics</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium">Schedule Study</h4>
                <p className="text-sm text-muted-foreground">Plan your study sessions and goals</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium">Generate Reports</h4>
                <p className="text-sm text-muted-foreground">Create and export performance reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </CardTitle>
            <CardDescription>Speed up your workflow with these keyboard shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm">{shortcut.action}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {shortcut.key}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find answers to common questions about ScoreTracker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  {index < filteredFAQs.length - 1 && <Separator />}
                </div>
              ))}
              {filteredFAQs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No FAQs found matching your search.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact & Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact & Feedback
            </CardTitle>
            <CardDescription>Get in touch with us or share your feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Get Support</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    support@scoretracker.com
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Help Center
                  </Button>
                </div>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <h4 className="font-medium">Send Feedback</h4>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your feedback"
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your experience or suggestion"
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Feedback
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
