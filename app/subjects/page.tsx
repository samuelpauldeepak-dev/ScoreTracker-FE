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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Atom,
  Flag as Flask,
  Leaf,
  Calculator,
  Globe,
  Users,
  Zap,
  Microscope,
  Brain,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { Subject, Topic } from "@/lib/store"

const iconOptions = [
  { name: "Atom", icon: Atom },
  { name: "Flask", icon: Flask },
  { name: "Leaf", icon: Leaf },
  { name: "Calculator", icon: Calculator },
  { name: "Globe", icon: Globe },
  { name: "Users", icon: Users },
  { name: "Zap", icon: Zap },
  { name: "Microscope", icon: Microscope },
  { name: "Brain", icon: Brain },
  { name: "BookOpen", icon: BookOpen },
]

const colorOptions = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#dc2626", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
  "#ec4899", // Pink
  "#6b7280", // Gray
]

export default function SubjectsPage() {
  const { subjects, tests, addSubject, updateSubject, deleteSubject } = useAppStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddTopicDialogOpen, setIsAddTopicDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editingTopic, setEditingTopic] = useState<{ subject: Subject; topic: Topic } | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)
  const [selectedSubjectForTopic, setSelectedSubjectForTopic] = useState<Subject | null>(null)

  // Form state for subjects
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    color: colorOptions[0],
    icon: "BookOpen",
  })

  // Form state for topics
  const [topicForm, setTopicForm] = useState({
    name: "",
    difficulty: "medium" as const,
    progress: "0",
  })

  const resetSubjectForm = () => {
    setSubjectForm({
      name: "",
      color: colorOptions[0],
      icon: "BookOpen",
    })
  }

  const resetTopicForm = () => {
    setTopicForm({
      name: "",
      difficulty: "medium",
      progress: "0",
    })
  }

  const handleAddSubject = () => {
    if (!subjectForm.name) return

    const newSubject: Omit<Subject, "id"> = {
      name: subjectForm.name,
      color: subjectForm.color,
      icon: subjectForm.icon,
      topics: [],
    }

    addSubject(newSubject)
    setIsAddDialogOpen(false)
    resetSubjectForm()
  }

  const handleEditSubject = () => {
    if (!editingSubject || !subjectForm.name) return

    const updates: Partial<Subject> = {
      name: subjectForm.name,
      color: subjectForm.color,
      icon: subjectForm.icon,
    }

    updateSubject(editingSubject.id, updates)
    setEditingSubject(null)
    resetSubjectForm()
  }

  const handleDeleteSubject = () => {
    if (deletingSubject) {
      deleteSubject(deletingSubject.id)
      setDeletingSubject(null)
    }
  }

  const handleAddTopic = () => {
    if (!selectedSubjectForTopic || !topicForm.name) return

    const newTopic: Topic = {
      id: Date.now().toString(),
      name: topicForm.name,
      difficulty: topicForm.difficulty,
      progress: Number.parseInt(topicForm.progress),
      testsCount: 0,
    }

    const updatedTopics = [...selectedSubjectForTopic.topics, newTopic]
    updateSubject(selectedSubjectForTopic.id, { topics: updatedTopics })

    setIsAddTopicDialogOpen(false)
    setSelectedSubjectForTopic(null)
    resetTopicForm()
  }

  const handleEditTopic = () => {
    if (!editingTopic || !topicForm.name) return

    const updatedTopics = editingTopic.subject.topics.map((topic) =>
      topic.id === editingTopic.topic.id
        ? {
            ...topic,
            name: topicForm.name,
            difficulty: topicForm.difficulty,
            progress: Number.parseInt(topicForm.progress),
          }
        : topic,
    )

    updateSubject(editingTopic.subject.id, { topics: updatedTopics })
    setEditingTopic(null)
    resetTopicForm()
  }

  const handleDeleteTopic = (subject: Subject, topicId: string) => {
    const updatedTopics = subject.topics.filter((topic) => topic.id !== topicId)
    updateSubject(subject.id, { topics: updatedTopics })
  }

  const openEditSubjectDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setSubjectForm({
      name: subject.name,
      color: subject.color,
      icon: subject.icon,
    })
  }

  const openEditTopicDialog = (subject: Subject, topic: Topic) => {
    setEditingTopic({ subject, topic })
    setTopicForm({
      name: topic.name,
      difficulty: topic.difficulty,
      progress: topic.progress.toString(),
    })
  }

  const getSubjectStats = (subject: Subject) => {
    const subjectTests = tests.filter((test) => test.subject === subject.name)
    const totalTests = subjectTests.length
    const averageScore =
      totalTests > 0
        ? Math.round(subjectTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / totalTests)
        : 0
    const overallProgress =
      subject.topics.length > 0
        ? Math.round(subject.topics.reduce((sum, topic) => sum + topic.progress, 0) / subject.topics.length)
        : 0

    return { totalTests, averageScore, overallProgress }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.name === iconName)
    return iconOption ? iconOption.icon : BookOpen
  }

  const overallStats = {
    totalSubjects: subjects.length,
    totalTopics: subjects.reduce((sum, subject) => sum + subject.topics.length, 0),
    averageProgress:
      subjects.length > 0
        ? Math.round(
            subjects.reduce((sum, subject) => {
              const subjectProgress =
                subject.topics.length > 0
                  ? subject.topics.reduce((topicSum, topic) => topicSum + topic.progress, 0) / subject.topics.length
                  : 0
              return sum + subjectProgress
            }, 0) / subjects.length,
          )
        : 0,
    completedTopics: subjects.reduce(
      (sum, subject) => sum + subject.topics.filter((topic) => topic.progress >= 90).length,
      0,
    ),
  }

  return (
    <DashboardLayout>
      {/* widen container slightly for 3-col grid breathing room; keep responsive padding */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Subject & Topic Management</h1>
            <p className="text-muted-foreground">
              Organize your study materials, track progress, and manage topics across subjects
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Create a new subject to organize your study topics</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    placeholder="e.g., Physics, Chemistry, Biology"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          subjectForm.color === color ? "border-foreground" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSubjectForm({ ...subjectForm, color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject Icon</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <button
                          key={option.name}
                          type="button"
                          className={`p-2 rounded-md border ${
                            subjectForm.icon === option.name
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-muted"
                          }`}
                          onClick={() => setSubjectForm({ ...subjectForm, icon: option.name })}
                        >
                          <IconComponent className="h-5 w-5 mx-auto" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject}>Add Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalSubjects}</div>
              <p className="text-xs text-muted-foreground">Active subjects</p>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalTopics}</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageProgress}%</div>
              <p className="text-xs text-muted-foreground">Overall completion</p>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Topics</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.completedTopics}</div>
              <p className="text-xs text-muted-foreground">90%+ progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject)
            const IconComponent = getIconComponent(subject.icon)

            return (
              <Card key={subject.id} className="relative surface surface-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: subject.color }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <CardDescription>{subject.topics.length} topics</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditSubjectDialog(subject)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setDeletingSubject(subject)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{subject.name}"? This will also delete all topics within
                              this subject. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteSubject}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subject Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalTests}</div>
                      <div className="text-xs text-muted-foreground">Tests</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.averageScore}%</div>
                      <div className="text-xs text-muted-foreground">Avg Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.overallProgress}%</div>
                      <div className="text-xs text-muted-foreground">Progress</div>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{stats.overallProgress}%</span>
                    </div>
                    <Progress value={stats.overallProgress} />
                  </div>

                  {/* Topics List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Topics</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubjectForTopic(subject)
                          setIsAddTopicDialogOpen(true)
                        }}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Topic
                      </Button>
                    </div>

                    {subject.topics.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {subject.topics.map((topic) => (
                          <div key={topic.id} className="flex items-center justify-between p-2 rounded-lg border">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium truncate">{topic.name}</span>
                                <div className="flex items-center space-x-1 ml-2">
                                  <Badge variant="outline" className={getDifficultyColor(topic.difficulty)}>
                                    {topic.difficulty}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => openEditTopicDialog(subject, topic)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleDeleteTopic(subject, topic.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Progress value={topic.progress} className="flex-1 h-2" />
                                <span className="text-xs text-muted-foreground w-10 text-right">{topic.progress}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No topics yet. Add your first topic to get started!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {subjects.length === 0 && (
            <Card className="col-span-full surface">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No subjects yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first subject to start organizing your study materials and tracking progress.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Subject
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Subject Dialog */}
        <Dialog open={!!editingSubject} onOpenChange={(open) => !open && setEditingSubject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
              <DialogDescription>Update the subject details and appearance</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subject-name">Subject Name</Label>
                <Input
                  id="edit-subject-name"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Subject Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        subjectForm.color === color ? "border-foreground" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSubjectForm({ ...subjectForm, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.name}
                        type="button"
                        className={`p-2 rounded-md border ${
                          subjectForm.icon === option.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted"
                        }`}
                        onClick={() => setSubjectForm({ ...subjectForm, icon: option.name })}
                      >
                        <IconComponent className="h-5 w-5 mx-auto" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingSubject(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubject}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Topic Dialog */}
        <Dialog open={isAddTopicDialogOpen} onOpenChange={setIsAddTopicDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Topic</DialogTitle>
              <DialogDescription>Add a new topic to {selectedSubjectForTopic?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic-name">Topic Name</Label>
                <Input
                  id="topic-name"
                  placeholder="e.g., Mechanics, Organic Chemistry"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-difficulty">Difficulty</Label>
                  <Select
                    value={topicForm.difficulty}
                    onValueChange={(value: any) => setTopicForm({ ...topicForm, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-progress">Initial Progress (%)</Label>
                  <Input
                    id="topic-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={topicForm.progress}
                    onChange={(e) => setTopicForm({ ...topicForm, progress: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTopicDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTopic}>Add Topic</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Topic Dialog */}
        <Dialog open={!!editingTopic} onOpenChange={(open) => !open && setEditingTopic(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Topic</DialogTitle>
              <DialogDescription>Update the topic details and progress</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-topic-name">Topic Name</Label>
                <Input
                  id="edit-topic-name"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-topic-difficulty">Difficulty</Label>
                  <Select
                    value={topicForm.difficulty}
                    onValueChange={(value: any) => setTopicForm({ ...topicForm, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-topic-progress">Progress (%)</Label>
                  <Input
                    id="edit-topic-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={topicForm.progress}
                    onChange={(e) => setTopicForm({ ...topicForm, progress: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTopic(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditTopic}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
