"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Send,
  MessageCircle,
  Users,
  UserPlus,
  Plus,
  Sparkles,
  Phone,
  Video,
  MoreVertical,
  ImageIcon,
  Paperclip,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { format } from "date-fns"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "ai"
}

interface Conversation {
  id: string
  name: string
  type: "user" | "group" | "mentor" | "ai"
  lastMessage: string
  timestamp: Date
  unread: number
  avatar: string
  members?: number
  online?: boolean
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "NEET 2024 Study Group",
    type: "group",
    lastMessage: "Hey, anyone up for a study session tomorrow?",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    unread: 3,
    avatar: "/diverse-study-group.png",
    members: 24,
    messages: [
      {
        id: "m1",
        senderId: "user1",
        senderName: "Priya Sharma",
        content: "Good morning everyone! Ready for today's Physics revision?",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: "text",
      },
      {
        id: "m2",
        senderId: "user2",
        senderName: "Rahul Kumar",
        content: "Yes! Let's focus on electromagnetic induction today.",
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        type: "text",
      },
      {
        id: "m3",
        senderId: "user3",
        senderName: "Anjali Verma",
        content: "Hey, anyone up for a study session tomorrow?",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: "text",
      },
    ],
  },
  {
    id: "2",
    name: "Dr. Kumar (Mentor)",
    type: "mentor",
    lastMessage: "Your recent test results are impressive! Keep it up.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    unread: 1,
    avatar: "/mentor-teacher.jpg",
    online: true,
    messages: [
      {
        id: "m4",
        senderId: "mentor1",
        senderName: "Dr. Kumar",
        content: "I reviewed your latest mock test. Your performance in Organic Chemistry has improved significantly!",
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        type: "text",
      },
      {
        id: "m5",
        senderId: "me",
        senderName: "You",
        content: "Thank you sir! I've been practicing daily.",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: "text",
      },
      {
        id: "m6",
        senderId: "mentor1",
        senderName: "Dr. Kumar",
        content: "Your recent test results are impressive! Keep it up.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: "text",
      },
    ],
  },
  {
    id: "3",
    name: "AI Study Assistant",
    type: "ai",
    lastMessage: "I can help you with practice questions and explanations!",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unread: 0,
    avatar: "/ai-assistant-robot.png",
    messages: [
      {
        id: "m7",
        senderId: "ai",
        senderName: "AI Assistant",
        content:
          "Hello! I'm your AI study assistant. I can help you with:\n\n• Explaining difficult concepts\n• Generating practice questions\n• Providing study tips\n• Analyzing your weak areas\n\nWhat would you like help with today?",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: "ai",
      },
    ],
  },
  {
    id: "4",
    name: "JEE Aspirants 2024",
    type: "group",
    lastMessage: "Check out these advanced calculus problems",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unread: 0,
    avatar: "/jee-students.jpg",
    members: 48,
    messages: [
      {
        id: "m8",
        senderId: "user4",
        senderName: "Vikram Patel",
        content: "Check out these advanced calculus problems",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        type: "text",
      },
    ],
  },
]

const mockUsers = [
  {
    id: "u1",
    name: "Priya Sharma",
    status: "Studying Biology",
    avatar: "/diverse-student-girl.png",
    online: true,
    exam: "NEET",
  },
  {
    id: "u2",
    name: "Rahul Kumar",
    status: "Mock test prep",
    avatar: "/student-boy.png",
    online: true,
    exam: "JEE",
  },
  {
    id: "u3",
    name: "Anjali Verma",
    status: "Online",
    avatar: "/diverse-students-studying.png",
    online: true,
    exam: "NEET",
  },
  {
    id: "u4",
    name: "Vikram Patel",
    status: "Offline",
    avatar: "/student-male-studying.png",
    online: false,
    exam: "JEE",
  },
]

const mockGroups = [
  { id: "g1", name: "Physics Wizards", members: 32, category: "Subject", exam: "NEET" },
  { id: "g2", name: "Chemistry Masters", members: 28, category: "Subject", exam: "NEET" },
  { id: "g3", name: "Math Olympiad Prep", members: 45, category: "Subject", exam: "JEE" },
  { id: "g4", name: "NEET 2024 All India", members: 156, category: "Exam Prep", exam: "NEET" },
]

const mockMentors = [
  {
    id: "m1",
    name: "Dr. Rajesh Kumar",
    expertise: "Physics & Mathematics",
    experience: "15+ years",
    students: 240,
    rating: 4.9,
    avatar: "/teacher-mentor.jpg",
  },
  {
    id: "m2",
    name: "Prof. Meena Iyer",
    expertise: "Organic Chemistry",
    experience: "12+ years",
    students: 180,
    rating: 4.8,
    avatar: "/teacher-female.jpg",
  },
  {
    id: "m3",
    name: "Dr. Amit Singh",
    expertise: "Biology (Zoology)",
    experience: "10+ years",
    students: 160,
    rating: 4.7,
    avatar: "/teacher-biology.jpg",
  },
]

export default function MessagesPage() {
  const { user } = useAppStore()
  const [conversations] = useState<Conversation[]>(mockConversations)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewChat, setShowNewChat] = useState(false)
  const [loading, setLoading] = useState(false)

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      senderName: "You",
      content: messageInput,
      timestamp: new Date(),
      type: "text",
    }

    setMessageInput("")
  }

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "group":
        return <Users className="h-4 w-4" />
      case "ai":
        return <Sparkles className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Messages</h1>
          <p className="text-muted-foreground text-balance">Connect with students, mentors, and study groups</p>
        </div>
        <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Start a New Conversation</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="users" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">Students</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="mentors">Mentors</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-9" />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {mockUsers.map((u) => (
                      <button
                        key={u.id}
                        className="w-full p-3 hover:bg-accent rounded-lg transition-colors text-left flex items-center gap-3"
                        onClick={() => setShowNewChat(false)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={u.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{u.name[0]}</AvatarFallback>
                          </Avatar>
                          {u.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{u.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{u.status}</p>
                        </div>
                        <Badge variant="outline">{u.exam}</Badge>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="groups" className="space-y-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search groups..." className="pl-9" />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {mockGroups.map((g) => (
                      <button
                        key={g.id}
                        className="w-full p-3 hover:bg-accent rounded-lg transition-colors text-left flex items-center gap-3"
                        onClick={() => setShowNewChat(false)}
                      >
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{g.name}</p>
                          <p className="text-sm text-muted-foreground">{g.members} members</p>
                        </div>
                        <Badge variant="outline">{g.exam}</Badge>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="mentors" className="space-y-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search mentors..." className="pl-9" />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {mockMentors.map((m) => (
                      <button
                        key={m.id}
                        className="w-full p-3 hover:bg-accent rounded-lg transition-colors text-left flex items-center gap-3"
                        onClick={() => setShowNewChat(false)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={m.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{m.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{m.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{m.expertise}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {m.experience}
                            </Badge>
                            <span className="text-xs text-muted-foreground">★ {m.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-4 hover:bg-accent transition-colors text-left flex items-start gap-3 ${
                    activeConversation?.id === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{conv.name[0]}</AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <p className="font-medium truncate">{conv.name}</p>
                        {getConversationIcon(conv.type)}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(conv.timestamp, "h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    {conv.members && <p className="text-xs text-muted-foreground mt-1">{conv.members} members</p>}
                  </div>
                  {conv.unread > 0 && (
                    <Badge variant="default" className="shrink-0">
                      {conv.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{activeConversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {activeConversation.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {activeConversation.name}
                        {getConversationIcon(activeConversation.type)}
                      </CardTitle>
                      {activeConversation.members ? (
                        <p className="text-sm text-muted-foreground">{activeConversation.members} members</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {activeConversation.online ? "Online" : "Offline"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.senderId === "me" ? "flex-row-reverse" : ""}`}
                    >
                      {message.senderId !== "me" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{message.senderName[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`flex flex-col gap-1 max-w-[70%] ${message.senderId === "me" ? "items-end" : ""}`}
                      >
                        {message.senderId !== "me" && (
                          <span className="text-xs font-medium text-muted-foreground">{message.senderName}</span>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === "ai"
                              ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                              : message.senderId === "me"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{format(message.timestamp, "h:mm a")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MessageCircle className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <div>
                  <h3 className="font-semibold mb-1">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
