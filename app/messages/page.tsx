"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send, Search, Star, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Message {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  read: boolean
  starred: boolean
  type: "system" | "support" | "notification"
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")

  const messages: Message[] = [
    {
      id: "1",
      from: "ScoreTracker System",
      subject: "Welcome to ScoreTracker!",
      preview: "Thank you for joining ScoreTracker. Here are some tips to get started...",
      date: "2024-01-15",
      read: false,
      starred: true,
      type: "system",
    },
    {
      id: "2",
      from: "Analytics Engine",
      subject: "Weekly Performance Report",
      preview: "Your performance has improved by 12% this week. Great job!",
      date: "2024-01-22",
      read: true,
      starred: false,
      type: "notification",
    },
    {
      id: "3",
      from: "Support Team",
      subject: "Feature Update: New Analytics Dashboard",
      preview: "We've added new features to help you track your progress better...",
      date: "2024-01-25",
      read: false,
      starred: false,
      type: "support",
    },
    {
      id: "4",
      from: "Goal Tracker",
      subject: "Goal Achievement Alert",
      preview: "Congratulations! You've achieved your monthly test goal.",
      date: "2024-01-28",
      read: true,
      starred: true,
      type: "notification",
    },
  ]

  const filteredMessages = messages.filter(
    (message) =>
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendReply = () => {
    if (replyText.trim()) {
      toast.success("Reply sent successfully!")
      setReplyText("")
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "system":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300"
      case "support":
        return "bg-green-500/10 text-green-700 dark:text-green-300"
      case "notification":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 md:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Stay updated with notifications, reports, and system messages.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="card-surface">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Inbox</CardTitle>
                <Badge variant="secondary">{messages.filter((m) => !m.read).length} unread</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 border-l-2 ${
                      selectedMessage?.id === message.id
                        ? "bg-muted border-l-primary"
                        : message.read
                          ? "border-l-transparent"
                          : "border-l-primary/50 bg-primary/5"
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-medium truncate ${!message.read ? "font-semibold" : ""}`}>
                            {message.from}
                          </p>
                          {message.starred && <Star className="w-3 h-3 text-amber-500 fill-current" />}
                        </div>
                        <p className={`text-sm truncate ${!message.read ? "font-medium" : "text-muted-foreground"}`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{message.preview}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.date).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(message.type)}`}>
                          {message.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No messages found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="card-surface">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedMessage.subject}
                      {selectedMessage.starred && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>From: {selectedMessage.from}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Clock className="w-3 h-3" />
                      <span>{new Date(selectedMessage.date).toLocaleDateString()}</span>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={getTypeColor(selectedMessage.type)}>
                    {selectedMessage.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p>{selectedMessage.preview}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Reply</h4>
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="bg-input"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-surface">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No message selected</h3>
                  <p className="text-sm">Select a message from the inbox to view its contents</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
