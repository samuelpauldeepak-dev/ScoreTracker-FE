"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Target, TrendingUp, BookOpen } from "lucide-react"
import { AddTopicDialog } from "@/components/subjects/add-topic-dialog"
import { EditTopicDialog } from "@/components/subjects/edit-topic-dialog"
import { DeleteTopicDialog } from "@/components/subjects/delete-topic-dialog"

interface SubjectDetailsDialogProps {
  subjectId: string
  onClose: () => void
}

export function SubjectDetailsDialog({ subjectId, onClose }: SubjectDetailsDialogProps) {
  const { subjects, topics, tests } = useAppStore()
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [editingTopic, setEditingTopic] = useState<string | null>(null)
  const [deletingTopic, setDeletingTopic] = useState<string | null>(null)

  const subject = subjects.find((s) => s.id === subjectId)
  const subjectTopics = topics.filter((topic) => topic.subjectId === subjectId)
  const subjectTests = tests.filter((test) => test.subject === subject?.name)

  if (!subject) return null

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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const completedTopics = subjectTopics.filter((topic) => topic.progress >= 100).length
  const averageProgress =
    subjectTopics.length > 0
      ? Math.round(subjectTopics.reduce((sum, topic) => sum + topic.progress, 0) / subjectTopics.length)
      : 0
  const averageScore =
    subjectTests.length > 0
      ? Math.round(subjectTests.reduce((sum, test) => sum + test.percentage, 0) / subjectTests.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl"
          style={{ backgroundColor: subject.color }}
        >
          {subject.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{subject.name}</h2>
          <p className="text-muted-foreground">
            {subjectTopics.length} topics • {completedTopics} completed • {averageProgress}% progress
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTopics}/{subjectTopics.length}
            </div>
            <Progress value={averageProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">From {subjectTests.length} tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectTests.length}</div>
            <p className="text-xs text-muted-foreground">Tests completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="topics" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tests">Recent Tests</TabsTrigger>
          </TabsList>

          <Dialog open={showAddTopic} onOpenChange={setShowAddTopic}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Topic</DialogTitle>
              </DialogHeader>
              <AddTopicDialog subjectId={subjectId} onClose={() => setShowAddTopic(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="topics" className="space-y-4">
          {subjectTopics.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No topics yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add topics to start tracking your progress in this subject
                </p>
                <Button onClick={() => setShowAddTopic(true)} size="sm">
                  Add First Topic
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {subjectTopics.map((topic) => (
                <Card key={topic.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{topic.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(topic.difficulty)} variant="secondary">
                            {topic.difficulty}
                          </Badge>
                          {topic.lastStudied && (
                            <span className="text-xs text-muted-foreground">
                              Last studied: {new Date(topic.lastStudied).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2" onClick={() => setEditingTopic(topic.id)}>
                            <Edit className="h-4 w-4" />
                            Edit Topic
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() => setDeletingTopic(topic.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className={`font-medium ${getProgressColor(topic.progress)}`}>{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {subjectTests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No tests found for this subject</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {subjectTests.slice(0, 5).map((test) => (
                <Card key={test.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(test.date).toLocaleDateString()} • {test.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{test.percentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        {test.score}/{test.totalMarks}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={!!editingTopic} onOpenChange={() => setEditingTopic(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          {editingTopic && <EditTopicDialog topicId={editingTopic} onClose={() => setEditingTopic(null)} />}
        </DialogContent>
      </Dialog>

      <DeleteTopicDialog topicId={deletingTopic} onClose={() => setDeletingTopic(null)} />
    </div>
  )
}
