"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { SubjectPerformance } from "@/components/dashboard/subject-performance"
import { RecentTests } from "@/components/dashboard/recent-tests"
import { WeakAreasAnalysis } from "@/components/dashboard/weak-areas-analysis"
import { PerformancePredictions } from "@/components/dashboard/performance-predictions"
import { TrendingUp, Calendar, Plus, BookOpen, Target, Sparkles, Clock, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { format, addDays, isSameDay } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddEventDialog } from "@/components/calendar/add-event-dialog"
import { StudyPlannerDialog } from "@/components/calendar/study-planner-dialog"

export default function DashboardPage() {
  const { user, tests, subjects, calendarEvents } = useAppStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showStudyPlanner, setShowStudyPlanner] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening"

  const today = new Date()
  const upcomingEvents = calendarEvents
    .filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= addDays(today, 7)
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const todaysEvents = calendarEvents.filter((event) => isSameDay(new Date(event.date), today))

  const getEventIcon = (type: string) => {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-5 w-[500px]" />
        </div>
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">
          {greeting}, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground text-balance">
          Here's your performance overview and insights to help you excel in your exams.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button className="gap-2" onClick={() => router.push("/tests")}>
          <Plus className="h-4 w-4" />
          Add Test Result
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowAddEvent(true)}>
          <Calendar className="h-4 w-4" />
          Schedule Study Session
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowStudyPlanner(true)}>
          <BookOpen className="h-4 w-4" />
          View Study Plan
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => router.push("/calendar")}>
          <Target className="h-4 w-4" />
          Set Goals
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            AI Daily Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-background/50 border">
            <p className="text-sm">
              <strong>Today's Focus:</strong> You have {todaysEvents.length} events scheduled. Your recent Physics
              performance shows improvement - keep the momentum!
            </p>
          </div>
          <div className="p-3 rounded-lg bg-background/50 border">
            <p className="text-sm">
              <strong>Study Recommendation:</strong> Spend 45 minutes on Chemistry (Organic) - it's been 3 days since
              your last session.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push("/analytics")}>
            View More Insights
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <MetricsCards />

      {/* Main Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Trends
              </CardTitle>
              <CardDescription>Track your score progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Compare your performance across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <SubjectPerformance />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Insights & Activity */}
        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => router.push("/calendar")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">No events scheduled for today</p>
                  <Button size="sm" variant="outline" onClick={() => setShowAddEvent(true)}>
                    Add Event
                  </Button>
                </div>
              ) : (
                todaysEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="text-xl">{getEventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.time || "All day"}</p>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Performance Predictions */}
          <PerformancePredictions />

          {/* Weak Areas Analysis */}
          <WeakAreasAnalysis />

          {/* Recent Tests */}
          <RecentTests />

          {/* Study Streak */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">7 days</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Personal Best!
                </Badge>
              </div>
              <Progress value={70} className="h-2" />
              <p className="text-sm text-muted-foreground">Keep it up! You're on track to reach your 10-day goal.</p>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => router.push("/calendar")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-chart-1 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(event.date), "MMM d, h:mm a")}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Study Session</DialogTitle>
          </DialogHeader>
          <AddEventDialog onClose={() => setShowAddEvent(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showStudyPlanner} onOpenChange={setShowStudyPlanner}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Study Planner</DialogTitle>
          </DialogHeader>
          <StudyPlannerDialog onClose={() => setShowStudyPlanner(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
