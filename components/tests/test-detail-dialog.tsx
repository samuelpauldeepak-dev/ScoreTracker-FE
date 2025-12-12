"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"
import { format } from "date-fns"
import { Calendar, BookOpen, Tag, Target, TrendingUp, Maximize2, Edit2, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

interface TestDetailDialogProps {
  testId: string | null
  open: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TestDetailDialog({ testId, open, onClose, onEdit, onDelete }: TestDetailDialogProps) {
  const { tests, subjects } = useAppStore()
  const router = useRouter()

  const test = tests.find((t) => t.id === testId)
  const subject = subjects.find((s) => s.id === test?.subjectId)

  if (!test) return null

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mock":
        return "bg-chart-1 text-white"
      case "practice":
        return "bg-chart-2 text-white"
      case "sectional":
        return "bg-chart-3 text-white"
      case "full":
        return "bg-chart-4 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { label: "Excellent", color: "text-green-600" }
    if (percentage >= 60) return { label: "Good", color: "text-yellow-600" }
    if (percentage >= 40) return { label: "Average", color: "text-orange-600" }
    return { label: "Needs Improvement", color: "text-red-600" }
  }

  const performance = getPerformanceLevel(test.percentage)

  const handleOpenFullScreen = () => {
    onClose()
    router.push(`/tests/${testId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{test.name}</DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getCategoryColor(test.category)}>{test.category}</Badge>
                <Badge variant="outline" className="gap-1">
                  <BookOpen className="h-3 w-3" />
                  {subject?.name || test.subject}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleOpenFullScreen} title="Open in full screen">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onEdit} title="Edit test">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive" title="Delete test">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Score Section */}
          <div className="p-6 rounded-lg bg-muted/50 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{test.score}</span>
                  <span className="text-2xl text-muted-foreground">/ {test.totalMarks}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                <div className={`text-4xl font-bold ${performance.color}`}>{test.percentage}%</div>
              </div>
            </div>
            <Progress value={test.percentage} className="h-3 mb-2" />
            <p className={`text-sm font-medium ${performance.color}`}>{performance.label}</p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Test Date</p>
                <p className="text-sm text-muted-foreground">{format(new Date(test.date), "MMMM dd, yyyy")}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(test.date), "EEEE")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              <Tag className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Category</p>
                <p className="text-sm text-muted-foreground capitalize">{test.category} Test</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {test.category === "mock" && "Full length mock examination"}
                  {test.category === "practice" && "Practice session"}
                  {test.category === "sectional" && "Subject-specific test"}
                  {test.category === "full" && "Complete test series"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          {test.notes && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Notes & Observations
              </h3>
              <p className="text-sm text-muted-foreground p-4 rounded-lg bg-muted/30">{test.notes}</p>
            </div>
          )}

          {test.timeSpent && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Time Spent</span>
              </div>
              <span className="text-sm font-semibold">{test.timeSpent} minutes</span>
            </div>
          )}

          {/* Performance Insights */}
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-blue-600">
              <TrendingUp className="h-4 w-4" />
              AI Insights
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {test.percentage >= 80 && <li>Excellent performance! Keep maintaining this consistency.</li>}
              {test.percentage >= 60 && test.percentage < 80 && (
                <li>Good progress. Focus on weak areas to push past 80%.</li>
              )}
              {test.percentage < 60 && <li>Consider revisiting fundamental concepts and practicing more.</li>}
              <li>Recommended: Review incorrect answers and attempt similar questions.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
