"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Target, Trophy, TrendingUp, Calendar } from "lucide-react"

interface GoalFormData {
  title: string
  type: "score" | "tests" | "study_hours" | "topics"
  target: number
  timeframe: "weekly" | "monthly" | "quarterly"
  subject?: string
  description?: string
}

interface GoalSettingDialogProps {
  onClose: () => void
}

// Mock goals data - in real app this would come from store
const mockGoals = [
  {
    id: "1",
    title: "Achieve 85% Average in Physics",
    type: "score",
    target: 85,
    current: 78,
    timeframe: "monthly",
    subject: "Physics",
    progress: 92,
    status: "in_progress",
  },
  {
    id: "2",
    title: "Complete 20 Mock Tests",
    type: "tests",
    target: 20,
    current: 12,
    timeframe: "monthly",
    progress: 60,
    status: "in_progress",
  },
  {
    id: "3",
    title: "Study 40 Hours per Week",
    type: "study_hours",
    target: 40,
    current: 35,
    timeframe: "weekly",
    progress: 88,
    status: "in_progress",
  },
]

export function GoalSettingDialog({ onClose }: GoalSettingDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"current" | "new">("current")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GoalFormData>()

  const onSubmit = async (data: GoalFormData) => {
    setIsLoading(true)
    try {
      // In real app, this would save to store
      toast({
        title: "Goal Set Successfully",
        description: `${data.title} has been added to your goals.`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set goal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case "score":
        return <Target className="h-4 w-4" />
      case "tests":
        return <Trophy className="h-4 w-4" />
      case "study_hours":
        return <Calendar className="h-4 w-4" />
      case "topics":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "in_progress":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "overdue":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "current" ? "default" : "outline"}
          onClick={() => setActiveTab("current")}
          className="flex-1"
        >
          Current Goals
        </Button>
        <Button
          variant={activeTab === "new" ? "default" : "outline"}
          onClick={() => setActiveTab("new")}
          className="flex-1"
        >
          Set New Goal
        </Button>
      </div>

      {activeTab === "current" ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Your Active Goals</h3>
            <p className="text-sm text-muted-foreground">Track your progress towards your study targets</p>
          </div>

          {mockGoals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No goals set yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set your first goal to start tracking your progress
                </p>
                <Button onClick={() => setActiveTab("new")} size="sm">
                  Set Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getGoalTypeIcon(goal.type)}
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(goal.status)} variant="secondary">
                        {goal.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {goal.subject && <CardDescription>Subject: {goal.subject}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {goal.current}/{goal.target} ({goal.progress}%)
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Timeframe: {goal.timeframe}</span>
                      <span>{goal.target - goal.current} remaining</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Set New Goal</h3>
            <p className="text-sm text-muted-foreground">Create a new goal to track your progress</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Achieve 90% in NEET Mock Tests"
              {...register("title", { required: "Goal title is required" })}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Goal Type *</Label>
              <Select onValueChange={(value) => setValue("type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">🎯 Score Target</SelectItem>
                  <SelectItem value="tests">📝 Number of Tests</SelectItem>
                  <SelectItem value="study_hours">⏰ Study Hours</SelectItem>
                  <SelectItem value="topics">📚 Topics to Complete</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Value *</Label>
              <Input
                id="target"
                type="number"
                min="1"
                placeholder="85"
                {...register("target", {
                  required: "Target value is required",
                  min: { value: 1, message: "Target must be at least 1" },
                })}
              />
              {errors.target && <p className="text-sm text-destructive">{errors.target.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe *</Label>
              <Select onValueChange={(value) => setValue("timeframe", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              {errors.timeframe && <p className="text-sm text-destructive">{errors.timeframe.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input id="subject" placeholder="e.g., Physics, Chemistry" {...register("subject")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Additional details about your goal" {...register("description")} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Setting Goal..." : "Set Goal"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
