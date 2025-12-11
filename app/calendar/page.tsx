"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  CalendarIcon,
  Target,
  Trophy,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TestTube,
  Bell,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { CalendarEvent } from "@/lib/store"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function CalendarPage() {
  const { calendarEvents, tests, subjects, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarView, setCalendarView] = useState<"month" | "week">("month")
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null)

  // Form state for events
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    type: "study" as const,
    description: "",
  })

  // Goals state (mock data for demo)
  const [goals, setGoals] = useState([
    {
      id: "1",
      title: "Weekly Test Goal",
      description: "Complete 3 tests this week",
      target: 3,
      current: 2,
      period: "week",
      deadline: "2024-02-04",
    },
    {
      id: "2",
      title: "Monthly Average Goal",
      description: "Achieve 80% average score this month",
      target: 80,
      current: 75,
      period: "month",
      deadline: "2024-02-29",
    },
  ])

  // Milestones (mock data for demo)
  const [milestones] = useState([
    {
      id: "1",
      title: "First 10 Tests",
      description: "Complete your first 10 tests",
      progress: 100,
      target: 10,
      achieved: true,
      badge: "🎯",
    },
    {
      id: "2",
      title: "Subject Master",
      description: "Score 90%+ in any subject 5 times",
      progress: 60,
      target: 5,
      achieved: false,
      badge: "⭐",
    },
    {
      id: "3",
      title: "Consistency Champion",
      description: "Take tests for 30 consecutive days",
      progress: 40,
      target: 30,
      achieved: false,
      badge: "🏆",
    },
  ])

  const resetEventForm = () => {
    setEventForm({
      title: "",
      date: "",
      type: "study",
      description: "",
    })
  }

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.date) return

    const newEvent: Omit<CalendarEvent, "id"> = {
      title: eventForm.title,
      date: eventForm.date,
      type: eventForm.type,
      description: eventForm.description,
    }

    addCalendarEvent(newEvent)
    setIsAddEventDialogOpen(false)
    resetEventForm()
  }

  const handleEditEvent = () => {
    if (!editingEvent || !eventForm.title || !eventForm.date) return

    const updates: Partial<CalendarEvent> = {
      title: eventForm.title,
      date: eventForm.date,
      type: eventForm.type,
      description: eventForm.description,
    }

    updateCalendarEvent(editingEvent.id, updates)
    setEditingEvent(null)
    resetEventForm()
  }

  const handleDeleteEvent = () => {
    if (deletingEvent) {
      deleteCalendarEvent(deletingEvent.id)
      setDeletingEvent(null)
    }
  }

  const openEditEventDialog = (event: CalendarEvent) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      date: event.date,
      type: event.type,
      description: event.description || "",
    })
  }

  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return calendarEvents.filter((event) => event.date === dateString)
  }

  const getTestsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return tests.filter((test) => test.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "test":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "study":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "reminder":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "test":
        return TestTube
      case "study":
        return BookOpen
      case "reminder":
        return Bell
      default:
        return CalendarIcon
    }
  }

  const upcomingEvents = calendarEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const thisWeekStats = {
    testsScheduled: calendarEvents.filter((event) => {
      const eventDate = new Date(event.date)
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return event.type === "test" && eventDate >= weekStart && eventDate <= weekEnd
    }).length,
    studySessions: calendarEvents.filter((event) => {
      const eventDate = new Date(event.date)
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return event.type === "study" && eventDate >= weekStart && eventDate <= weekEnd
    }).length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Calendar & Scheduling</h1>
            <p className="text-muted-foreground">
              Plan your study sessions, schedule tests, and track your progress milestones
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Target className="mr-2 h-4 w-4" />
                  Set Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set New Goal</DialogTitle>
                  <DialogDescription>Create a new goal to track your progress</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Goal Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tests">Number of Tests</SelectItem>
                        <SelectItem value="average">Average Score</SelectItem>
                        <SelectItem value="subject">Subject Mastery</SelectItem>
                        <SelectItem value="streak">Study Streak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Goal Description</Label>
                    <Input placeholder="e.g., Complete 5 tests this week" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target Value</Label>
                      <Input type="number" placeholder="5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Period</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Goal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Calendar Event</DialogTitle>
                  <DialogDescription>Schedule a test, study session, or reminder</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      placeholder="e.g., Physics Study Session"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select
                        value={eventForm.type}
                        onValueChange={(value: any) => setEventForm({ ...eventForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="study">Study Session</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description (Optional)</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Add any additional details..."
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisWeekStats.testsScheduled + thisWeekStats.studySessions}</div>
              <p className="text-xs text-muted-foreground">Events scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisWeekStats.studySessions}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Scheduled</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisWeekStats.testsScheduled}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((date, index) => {
                    const events = getEventsForDate(date)
                    const testsOnDate = getTestsForDate(date)
                    const hasEvents = events.length > 0 || testsOnDate.length > 0

                    return (
                      <div
                        key={index}
                        className={`
                          min-h-[80px] p-1 border rounded-lg cursor-pointer transition-colors
                          ${isCurrentMonth(date) ? "bg-background" : "bg-muted/30"}
                          ${isToday(date) ? "border-primary bg-primary/5" : "border-border"}
                          hover:bg-muted/50
                        `}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className={`text-sm font-medium ${isCurrentMonth(date) ? "" : "text-muted-foreground"}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1 mt-1">
                          {testsOnDate.slice(0, 2).map((test) => (
                            <div
                              key={test.id}
                              className="text-xs p-1 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 truncate"
                            >
                              {test.name}
                            </div>
                          ))}
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {events.length + testsOnDate.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{events.length + testsOnDate.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your next scheduled activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => {
                      const IconComponent = getEventTypeIcon(event.type)
                      return (
                        <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                          <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => openEditEventDialog(event)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setDeletingEvent(event)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming events. Add some to get started!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Goals Progress</CardTitle>
                <CardDescription>Track your current objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{goal.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} />
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Milestones</CardTitle>
            <CardDescription>Track your achievements and unlock new badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{milestone.badge}</span>
                      <h4 className="font-medium">{milestone.title}</h4>
                    </div>
                    {milestone.achieved && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        <Trophy className="mr-1 h-3 w-3" />
                        Achieved
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round((milestone.progress / milestone.target) * 100)}%</span>
                    </div>
                    <Progress value={(milestone.progress / milestone.target) * 100} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Event Dialog */}
        <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update the event details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-title">Event Title</Label>
                <Input
                  id="edit-event-title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-date">Date</Label>
                  <Input
                    id="edit-event-date"
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-type">Event Type</Label>
                  <Select
                    value={eventForm.type}
                    onValueChange={(value: any) => setEventForm({ ...eventForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study Session</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-description">Description (Optional)</Label>
                <Textarea
                  id="edit-event-description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingEvent(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditEvent}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
