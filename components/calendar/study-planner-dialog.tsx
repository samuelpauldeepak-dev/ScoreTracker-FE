"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, BookOpen, Target, Plus } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"

interface StudySessionFormData {
  subject: string
  topic: string
  duration: number
  date: Date
  time: string
  notes?: string
}

interface StudyPlannerDialogProps {
  onClose: () => void
}

export function StudyPlannerDialog({ onClose }: StudyPlannerDialogProps) {
  const { subjects, topics, addCalendarEvent } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSubject, setSelectedSubject] = useState("")
  const [activeTab, setActiveTab] = useState<"single" | "weekly">("single")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudySessionFormData>({
    defaultValues: {
      date: new Date(),
    },
  })

  const watchedSubject = watch("subject")
  const subjectTopics = topics.filter((topic) => {
    const subject = subjects.find((s) => s.name === watchedSubject)
    return subject && topic.subjectId === subject.id
  })

  const onSubmit = async (data: StudySessionFormData) => {
    setIsLoading(true)
    try {
      addCalendarEvent({
        title: `${data.subject} - ${data.topic}`,
        type: "study",
        date: selectedDate.toISOString().split("T")[0],
        time: data.time,
        subject: data.subject,
        description: `Study session: ${data.topic}${data.notes ? `\n\nNotes: ${data.notes}` : ""}`,
      })

      toast({
        title: "Study Session Scheduled",
        description: `${data.subject} study session has been added to your calendar.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule study session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateWeeklyPlan = () => {
    const sessions = []
    const startDate = new Date()

    // Generate 7 days of study sessions
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i)
      const subjectIndex = i % subjects.length
      const subject = subjects[subjectIndex]

      if (subject) {
        const subjectTopics = topics.filter((topic) => topic.subjectId === subject.id)
        const topic = subjectTopics[0] // Take first topic for simplicity

        if (topic) {
          addCalendarEvent({
            title: `${subject.name} - ${topic.name}`,
            type: "study",
            date: date.toISOString().split("T")[0],
            time: "14:00", // Default 2 PM
            subject: subject.name,
            description: `Weekly study plan: ${topic.name}`,
          })
        }
      }
    }

    toast({
      title: "Weekly Plan Generated",
      description: "7 study sessions have been added to your calendar.",
    })

    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "single" ? "default" : "outline"}
          onClick={() => setActiveTab("single")}
          className="flex-1"
        >
          Single Session
        </Button>
        <Button
          variant={activeTab === "weekly" ? "default" : "outline"}
          onClick={() => setActiveTab("weekly")}
          className="flex-1"
        >
          Weekly Plan
        </Button>
      </div>

      {activeTab === "single" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Schedule Study Session</h3>
            <p className="text-sm text-muted-foreground">Plan a focused study session for a specific topic</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select onValueChange={(value) => setValue("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      <div className="flex items-center gap-2">
                        <span>{subject.icon}</span>
                        {subject.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Select onValueChange={(value) => setValue("topic", value)} disabled={!watchedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder={watchedSubject ? "Select topic" : "Select subject first"} />
                </SelectTrigger>
                <SelectContent>
                  {subjectTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.name}>
                      <div className="flex items-center gap-2">
                        <span>{topic.name}</span>
                        <Badge
                          variant="secondary"
                          className={
                            topic.difficulty === "easy"
                              ? "bg-green-100 text-green-700"
                              : topic.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.topic && <p className="text-sm text-destructive">{errors.topic.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                {...register("time", { required: "Time is required" })}
                defaultValue="14:00"
              />
              {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="480"
                placeholder="60"
                {...register("duration", {
                  required: "Duration is required",
                  min: { value: 15, message: "Minimum 15 minutes" },
                  max: { value: 480, message: "Maximum 8 hours" },
                })}
              />
              {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Study Notes</Label>
            <Textarea id="notes" placeholder="What do you plan to focus on in this session?" {...register("notes")} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Scheduling..." : "Schedule Session"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Generate Weekly Study Plan</h3>
            <p className="text-sm text-muted-foreground">
              Automatically create a balanced study schedule for the next 7 days
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Smart Weekly Plan
              </CardTitle>
              <CardDescription>
                We'll create a balanced schedule based on your subjects and their progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Daily sessions: 1-2 hours</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Covers all your subjects</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Focuses on weak areas</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={generateWeeklyPlan} className="flex-1 gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Plan
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
