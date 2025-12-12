"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, Target, Hash, FileText } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { UpgradeDialog } from "@/components/upgrade-dialog"

interface TestFormData {
  name: string
  subject: string
  category: "mock" | "practice" | "sectional" | "full"
  score: number
  totalMarks: number
  date: Date
  duration?: number
  topics?: string
  correctAnswers?: number
  wrongAnswers?: number
  skippedQuestions?: number
  difficulty?: "easy" | "medium" | "hard"
  notes?: string
}

interface AddTestFormProps {
  onClose: () => void
}

export function AddTestForm({ onClose }: AddTestFormProps) {
  const { addTest, subjects, canCreateTest } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestFormData>({
    defaultValues: {
      date: new Date(),
    },
  })

  const watchedScore = watch("score")
  const watchedTotalMarks = watch("totalMarks")
  const watchedCorrect = watch("correctAnswers")
  const watchedWrong = watch("wrongAnswers")
  const watchedSkipped = watch("skippedQuestions")

  const percentage = watchedScore && watchedTotalMarks ? Math.round((watchedScore / watchedTotalMarks) * 100) : 0
  const totalQuestions = (watchedCorrect || 0) + (watchedWrong || 0) + (watchedSkipped || 0)

  const onSubmit = async (data: TestFormData) => {
    if (!canCreateTest()) {
      setShowUpgradeDialog(true)
      return
    }

    setIsLoading(true)
    try {
      const testData = {
        ...data,
        percentage,
        date: selectedDate.toISOString().split("T")[0],
        topics: data.topics ? data.topics.split(",").map((t) => t.trim()) : undefined,
      }

      addTest(testData)

      toast({
        title: "Test Added Successfully",
        description: `${data.name} has been added to your test history.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add test. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Basic Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Test Name *</Label>
              <Input
                id="name"
                placeholder="e.g., NEET Mock Test 1"
                {...register("name", { required: "Test name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

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
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mock">Mock Test</SelectItem>
                  <SelectItem value="practice">Practice Test</SelectItem>
                  <SelectItem value="sectional">Sectional Test</SelectItem>
                  <SelectItem value="full">Full Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select onValueChange={(value) => setValue("difficulty", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Duration (mins)
              </Label>
              <Input id="duration" type="number" min="1" placeholder="180" {...register("duration")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Test Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
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
        </div>

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Score Details
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="score">Score Obtained *</Label>
              <Input
                id="score"
                type="number"
                min="0"
                placeholder="85"
                {...register("score", {
                  required: "Score is required",
                  min: { value: 0, message: "Score must be positive" },
                })}
              />
              {errors.score && <p className="text-sm text-destructive">{errors.score.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
              <Input
                id="totalMarks"
                type="number"
                min="1"
                placeholder="100"
                {...register("totalMarks", {
                  required: "Total marks is required",
                  min: { value: 1, message: "Total marks must be at least 1" },
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Percentage</Label>
              <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                <Badge variant="secondary" className="text-base font-semibold">
                  {percentage}%
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="correctAnswers" className="text-green-600">
                <Hash className="h-3.5 w-3.5 inline mr-1" />
                Correct Answers
              </Label>
              <Input id="correctAnswers" type="number" min="0" placeholder="75" {...register("correctAnswers")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wrongAnswers" className="text-red-600">
                <Hash className="h-3.5 w-3.5 inline mr-1" />
                Wrong Answers
              </Label>
              <Input id="wrongAnswers" type="number" min="0" placeholder="15" {...register("wrongAnswers")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skippedQuestions" className="text-orange-600">
                <Hash className="h-3.5 w-3.5 inline mr-1" />
                Skipped
              </Label>
              <Input id="skippedQuestions" type="number" min="0" placeholder="10" {...register("skippedQuestions")} />
            </div>
          </div>

          {totalQuestions > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Total Questions:</span>
              <Badge variant="outline">{totalQuestions}</Badge>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topics">Topics Covered</Label>
            <Textarea
              id="topics"
              placeholder="Mechanics, Thermodynamics, Optics (comma-separated)"
              {...register("topics")}
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this test..."
              {...register("notes")}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Adding Test..." : "Add Test"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>

      <UpgradeDialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        reason="You've reached your test limit. Upgrade to add more tests and track your progress effectively."
      />
    </>
  )
}
