"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, BookOpen, Target, TrendingUp, Edit, Trash2, Eye, Sparkles } from "lucide-react"
import { AddSubjectDialog } from "@/components/subjects/add-subject-dialog"
import { SubjectDetailsDialog } from "@/components/subjects/subject-details-dialog"
import { EditSubjectDialog } from "@/components/subjects/edit-subject-dialog"
import { DeleteSubjectDialog } from "@/components/subjects/delete-subject-dialog"
import { SubscriptionLimitBanner } from "@/components/subscription-limit-banner"

export default function SubjectsPage() {
  const { subjects, topics, tests } = useAppStore()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [editingSubject, setEditingSubject] = useState<string | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<string | null>(null)

  const totalTopics = topics.length
  const completedTopics = topics.filter((topic) => topic.progress >= 100).length
  const averageProgress =
    topics.length > 0 ? Math.round(topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length) : 0

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "medium":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
      case "hard":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSubjectStats = (subjectId: string) => {
    const subjectTopics = topics.filter((topic) => topic.subjectId === subjectId)
    const subjectTests = tests.filter((test) => {
      const subject = subjects.find((s) => s.name === test.subject)
      return subject?.id === subjectId
    })

    const completedTopics = subjectTopics.filter((topic) => topic.progress >= 100).length
    const averageScore =
      subjectTests.length > 0
        ? Math.round(subjectTests.reduce((sum, test) => sum + test.percentage, 0) / subjectTests.length)
        : 0

    return {
      totalTopics: subjectTopics.length,
      completedTopics,
      averageScore,
      totalTests: subjectTests.length,
      progress:
        subjectTopics.length > 0
          ? Math.round(subjectTopics.reduce((sum, topic) => sum + topic.progress, 0) / subjectTopics.length)
          : 0,
    }
  }

  const getAIRecommendation = (subjectId: string) => {
    const stats = getSubjectStats(subjectId)
    const subject = subjects.find((s) => s.id === subjectId)

    if (!subject) return null

    if (stats.progress >= 80) {
      return {
        type: "excellent",
        message: `Excellent progress in ${subject.name}! Focus on advanced problem-solving and past year questions.`,
      }
    } else if (stats.progress >= 50) {
      return {
        type: "good",
        message: `Good progress in ${subject.name}. Allocate 45-60 min daily to reach 80%+ completion.`,
      }
    } else {
      return {
        type: "needs-attention",
        message: `${subject.name} needs more attention. Start with easy topics and build a strong foundation.`,
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Subject Management</h1>
          <p className="text-muted-foreground text-balance">Organize your subjects and track topic-wise progress</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <AddSubjectDialog onClose={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <SubscriptionLimitBanner type="subjects" />

      <Card className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            AI Study Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p>
              <strong>Balanced Approach:</strong> You have {subjects.length} subjects to manage. Aim for{" "}
              {Math.round(100 / subjects.length)}% time distribution per subject to maintain balance.
            </p>
            <p>
              <strong>Focus Priority:</strong>{" "}
              {subjects
                .map((s) => ({
                  name: s.name,
                  progress: getSubjectStats(s.id).progress,
                }))
                .sort((a, b) => a.progress - b.progress)
                .slice(0, 2)
                .map((s) => s.name)
                .join(" and ")}{" "}
              need immediate attention based on current progress.
            </p>
            <p>
              <strong>Today's Goal:</strong> Complete at least 2 topics from your weakest subject and review 1 topic
              from your strongest subject.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTopics}/{totalTopics}
            </div>
            <p className="text-xs text-muted-foreground">{averageProgress}% average progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <Progress value={averageProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject.id)
          const subjectTopics = topics.filter((topic) => topic.subjectId === subject.id)
          const aiRec = getAIRecommendation(subject.id)

          return (
            <Card key={subject.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: subject.color }} />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription>{stats.totalTopics} topics</CardDescription>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => setSelectedSubject(subject.id)}>
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => setEditingSubject(subject.id)}>
                        <Edit className="h-4 w-4" />
                        Edit Subject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-destructive"
                        onClick={() => setDeletingSubject(subject.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {aiRec && (
                  <div
                    className={`p-2 rounded-lg text-xs flex items-start gap-2 ${
                      aiRec.type === "excellent"
                        ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                        : aiRec.type === "good"
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                          : "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300"
                    }`}
                  >
                    <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{aiRec.message}</span>
                  </div>
                )}

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">{stats.progress}%</span>
                  </div>
                  <Progress value={stats.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Completed</p>
                    <p className="font-medium">
                      {stats.completedTopics}/{stats.totalTopics}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Score</p>
                    <p className="font-medium">{stats.averageScore}%</p>
                  </div>
                </div>

                {/* Recent Topics */}
                {subjectTopics.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recent Topics</p>
                    <div className="space-y-1">
                      {subjectTopics.slice(0, 3).map((topic) => (
                        <div key={topic.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{topic.name}</span>
                            <Badge className={getDifficultyColor(topic.difficulty)} variant="secondary">
                              {topic.difficulty}
                            </Badge>
                          </div>
                          <span className="font-medium">{topic.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  Manage Topics
                </Button>
              </CardContent>
            </Card>
          )
        })}

        {/* Add Subject Card */}
        <Card
          className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setShowAddDialog(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Add New Subject</h3>
            <p className="text-sm text-muted-foreground">
              Create a new subject to organize your topics and track progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subject Details</DialogTitle>
          </DialogHeader>
          {selectedSubject && (
            <SubjectDetailsDialog subjectId={selectedSubject} onClose={() => setSelectedSubject(null)} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingSubject} onOpenChange={() => setEditingSubject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          {editingSubject && <EditSubjectDialog subjectId={editingSubject} onClose={() => setEditingSubject(null)} />}
        </DialogContent>
      </Dialog>

      <DeleteSubjectDialog subjectId={deletingSubject} onClose={() => setDeletingSubject(null)} />
    </div>
  )
}
