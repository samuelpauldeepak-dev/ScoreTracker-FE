"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Plus, CalendarIcon, Target, Trophy, Clock } from "lucide-react"
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { AddEventDialog } from "@/components/calendar/add-event-dialog"
import { EventDetailsDialog } from "@/components/calendar/event-details-dialog"
import { GoalSettingDialog } from "@/components/calendar/goal-setting-dialog"
import { StudyPlannerDialog } from "@/components/calendar/study-planner-dialog"

export default function CalendarPage() {
  const { calendarEvents, tests } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showGoalSetting, setShowGoalSetting] = useState(false)
  const [showStudyPlanner, setShowStudyPlanner] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  // Get events for selected date
  const selectedDateEvents = calendarEvents.filter((event) => isSameDay(new Date(event.date), selectedDate))

  // Get upcoming events (next 7 days)
  const upcomingEvents = calendarEvents
    .filter((event) => {
      const eventDate = new Date(event.date)
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)
      return eventDate >= today && eventDate <= nextWeek
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get events for current month to show on calendar
  const currentMonth = selectedDate
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "test":
        return "bg-red-100 text-red-700 border-red-200"
      case "study":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "revision":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "test":
        return "📝"
      case "study":
        return "📚"
      case "revision":
        return "🔄"
      default:
        return "📅"
    }
  }

  // Calculate statistics
  const totalEvents = calendarEvents.length
  const testsThisMonth = calendarEvents.filter(
    (event) => event.type === "test" && isSameDay(new Date(event.date), currentMonth),
  ).length
  const studySessionsThisWeek = calendarEvents.filter((event) => {
    const eventDate = new Date(event.date)
    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return event.type === "study" && eventDate >= weekStart && eventDate <= weekEnd
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Calendar & Scheduling</h1>
          <p className="text-muted-foreground text-balance">Plan your study sessions and track important dates</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showStudyPlanner} onOpenChange={setShowStudyPlanner}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Clock className="h-4 w-4" />
                Study Planner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Study Planner</DialogTitle>
              </DialogHeader>
              <StudyPlannerDialog onClose={() => setShowStudyPlanner(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showGoalSetting} onOpenChange={setShowGoalSetting}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Target className="h-4 w-4" />
                Set Goals
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Goal Setting</DialogTitle>
              </DialogHeader>
              <GoalSettingDialog onClose={() => setShowGoalSetting(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Calendar Event</DialogTitle>
              </DialogHeader>
              <AddEventDialog onClose={() => setShowAddEvent(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Scheduled events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests This Month</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Upcoming tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studySessionsThisWeek}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Click on a date to view or add events</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (date) => calendarEvents.some((event) => isSameDay(new Date(event.date), date)),
                }}
                modifiersStyles={{
                  hasEvents: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    fontWeight: "bold",
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {format(selectedDate, "MMMM d, yyyy")}
                {isSameDay(selectedDate, new Date()) && <Badge className="ml-2">Today</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No events scheduled</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                    onClick={() => setShowAddEvent(true)}
                  >
                    Add Event
                  </Button>
                </div>
              ) : (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getEventTypeColor(
                      event.type,
                    )}`}
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        {event.time && <p className="text-sm opacity-75">{event.time}</p>}
                        {event.subject && <p className="text-xs opacity-60">{event.subject}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No upcoming events</p>
              ) : (
                upcomingEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "MMM dd")}
                        {event.time && ` • ${event.time}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => setShowAddEvent(true)}
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => setShowStudyPlanner(true)}
              >
                <Clock className="h-4 w-4" />
                Plan Study Session
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => setShowGoalSetting(true)}
              >
                <Target className="h-4 w-4" />
                Set New Goal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && <EventDetailsDialog eventId={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
