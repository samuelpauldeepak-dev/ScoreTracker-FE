"use client"

import { use } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Tag,
  Target,
  TrendingUp,
  Edit2,
  Trash2,
  Download,
  Share2,
  Clock,
} from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { tests, subjects, deleteTest } = useAppStore()
  const router = useRouter()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const test = tests.find((t) => t.id === resolvedParams.id)
  const subject = subjects.find((s) => s.id === test?.subjectId)

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Test not found</p>
        <Button onClick={() => router.push("/tests")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tests
        </Button>
      </div>
    )
  }

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
    if (percentage >= 80) return { label: "Excellent", color: "text-green-600", bgColor: "bg-green-500/10" }
    if (percentage >= 60) return { label: "Good", color: "text-yellow-600", bgColor: "bg-yellow-500/10" }
    if (percentage >= 40) return { label: "Average", color: "text-orange-600", bgColor: "bg-orange-500/10" }
    return { label: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-500/10" }
  }

  const performance = getPerformanceLevel(test.percentage)

  const handleDelete = () => {
    deleteTest(test.id)
    setShowDeleteDialog(false)
    toast({
      title: "Test Deleted",
      description: "The test has been removed from your history.",
    })
    router.push("/tests")
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your test report is being generated...",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "Test details link copied to clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/tests")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-balance">{test.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={getCategoryColor(test.category)}>{test.category}</Badge>
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {subject?.name || test.subject}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(test.date), "MMM dd, yyyy")}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:bg-destructive/10 bg-transparent"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Card */}
          <Card className={`border-2 ${performance.bgColor}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Test Performance</span>
                <Badge className={`${performance.color} bg-transparent border`} variant="outline">
                  {performance.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{test.score}</span>
                    <span className="text-3xl text-muted-foreground">/ {test.totalMarks}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">Percentage</p>
                  <div className={`text-5xl font-bold ${performance.color}`}>{test.percentage}%</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{test.percentage}%</span>
                </div>
                <Progress value={test.percentage} className="h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Test Date</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(test.date), "MMMM dd, yyyy")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(test.date), "EEEE")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Test Category</p>
                    <p className="text-sm text-muted-foreground capitalize">{test.category} Test</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {test.category === "mock" && "Full length mock examination"}
                      {test.category === "practice" && "Practice session"}
                      {test.category === "sectional" && "Subject-specific test"}
                      {test.category === "full" && "Complete test series"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {test.timeSpent && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Time Spent</p>
                      <p className="text-sm text-muted-foreground">{test.timeSpent} minutes</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.floor(test.timeSpent / 60)}h {test.timeSpent % 60}m
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Accuracy Rate</p>
                    <p className="text-sm text-muted-foreground">{test.percentage}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {test.score} out of {test.totalMarks} marks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          {test.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Notes & Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{test.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-5 w-5" />
                AI Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                {test.percentage >= 80 && (
                  <>
                    <p className="text-green-600 font-medium">Outstanding Performance!</p>
                    <p className="text-muted-foreground">
                      You're performing excellently in this subject. Keep maintaining this consistency and focus on
                      advanced concepts.
                    </p>
                  </>
                )}
                {test.percentage >= 60 && test.percentage < 80 && (
                  <>
                    <p className="text-yellow-600 font-medium">Good Progress</p>
                    <p className="text-muted-foreground">
                      You're on the right track. Focus on weak areas and practice more mock tests to cross 80%.
                    </p>
                  </>
                )}
                {test.percentage < 60 && (
                  <>
                    <p className="text-orange-600 font-medium">Room for Improvement</p>
                    <p className="text-muted-foreground">
                      Consider revisiting fundamental concepts. Regular practice and focused study sessions can help
                      boost your scores.
                    </p>
                  </>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium text-sm">Recommendations:</p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Review incorrect answers in detail</li>
                  <li>Attempt similar practice questions</li>
                  <li>Focus on time management strategies</li>
                  <li>Track improvement over multiple tests</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Marks Obtained</span>
                <span className="font-semibold">{test.score}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Marks</span>
                <span className="font-semibold">{test.totalMarks}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Percentage</span>
                <span className={`font-semibold ${performance.color}`}>{test.percentage}%</span>
              </div>
              {test.timeSpent && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-semibold">{test.timeSpent} min</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{test.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
