"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Download, Upload, Edit, Trash2, Calendar, Clock, Target, FileSpreadsheet } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { Test } from "@/lib/store"

export default function TestsPage() {
  const { tests, subjects, addTest, updateTest, deleteTest } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [deletingTest, setDeletingTest] = useState<Test | null>(null)

  const itemsPerPage = 10

  // Form state for adding/editing tests
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    category: "practice" as const,
    score: "",
    totalMarks: "",
    date: "",
    topics: "",
    difficulty: "medium" as const,
    timeSpent: "",
  })

  // Filter and sort tests
  const filteredTests = tests
    .filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.subject.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubject = subjectFilter === "all" || test.subject === subjectFilter
      const matchesCategory = categoryFilter === "all" || test.category === categoryFilter
      const matchesDifficulty = difficultyFilter === "all" || test.difficulty === difficultyFilter
      return matchesSearch && matchesSubject && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "subject":
          aValue = a.subject.toLowerCase()
          bValue = b.subject.toLowerCase()
          break
        case "score":
          aValue = (a.score / a.totalMarks) * 100
          bValue = (b.score / b.totalMarks) * 100
          break
        case "date":
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage)
  const paginatedTests = filteredTests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      category: "practice",
      score: "",
      totalMarks: "",
      date: "",
      topics: "",
      difficulty: "medium",
      timeSpent: "",
    })
  }

  const handleAddTest = () => {
    if (!formData.name || !formData.subject || !formData.score || !formData.totalMarks || !formData.date) {
      return
    }

    const newTest: Omit<Test, "id"> = {
      name: formData.name,
      subject: formData.subject,
      category: formData.category,
      score: Number.parseInt(formData.score),
      totalMarks: Number.parseInt(formData.totalMarks),
      date: formData.date,
      topics: formData.topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      difficulty: formData.difficulty,
      timeSpent: formData.timeSpent ? Number.parseInt(formData.timeSpent) : undefined,
    }

    addTest(newTest)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditTest = () => {
    if (
      !editingTest ||
      !formData.name ||
      !formData.subject ||
      !formData.score ||
      !formData.totalMarks ||
      !formData.date
    ) {
      return
    }

    const updates: Partial<Test> = {
      name: formData.name,
      subject: formData.subject,
      category: formData.category,
      score: Number.parseInt(formData.score),
      totalMarks: Number.parseInt(formData.totalMarks),
      date: formData.date,
      topics: formData.topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      difficulty: formData.difficulty,
      timeSpent: formData.timeSpent ? Number.parseInt(formData.timeSpent) : undefined,
    }

    updateTest(editingTest.id, updates)
    setEditingTest(null)
    resetForm()
  }

  const handleDeleteTest = () => {
    if (deletingTest) {
      deleteTest(deletingTest.id)
      setDeletingTest(null)
    }
  }

  const openEditDialog = (test: Test) => {
    setEditingTest(test)
    setFormData({
      name: test.name,
      subject: test.subject,
      category: test.category,
      score: test.score.toString(),
      totalMarks: test.totalMarks.toString(),
      date: test.date,
      topics: test.topics.join(", "),
      difficulty: test.difficulty,
      timeSpent: test.timeSpent?.toString() || "",
    })
  }

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        if (values.length >= 6) {
          const newTest: Omit<Test, "id"> = {
            name: values[0] || `Imported Test ${i}`,
            subject: values[1] || "General",
            category: (values[2] as any) || "practice",
            score: Number.parseInt(values[3]) || 0,
            totalMarks: Number.parseInt(values[4]) || 100,
            date: values[5] || new Date().toISOString().split("T")[0],
            topics: values[6] ? values[6].split(";").map((t) => t.trim()) : [],
            difficulty: (values[7] as any) || "medium",
            timeSpent: values[8] ? Number.parseInt(values[8]) : undefined,
          }
          addTest(newTest)
        }
      }
    }
    reader.readAsText(file)
    setIsImportDialogOpen(false)
  }

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Subject",
      "Category",
      "Score",
      "Total Marks",
      "Date",
      "Topics",
      "Difficulty",
      "Time Spent",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredTests.map((test) =>
        [
          test.name,
          test.subject,
          test.category,
          test.score,
          test.totalMarks,
          test.date,
          test.topics.join(";"),
          test.difficulty,
          test.timeSpent || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tests-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mock":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "practice":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "sectional":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "full":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Test Management</h1>
            <p className="text-muted-foreground">
              Manage your test records, track performance, and analyze your progress
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Tests from CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with test data. Expected format: Name, Subject, Category, Score, Total Marks,
                    Date, Topics, Difficulty, Time Spent
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input id="csv-file" type="file" accept=".csv" onChange={handleImportCSV} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">CSV Format Example:</p>
                    <code className="block mt-1 p-2 bg-muted rounded text-xs">
                      Name,Subject,Category,Score,Total Marks,Date,Topics,Difficulty,Time Spent
                      <br />
                      Physics Mock 1,Physics,mock,85,100,2024-01-15,Mechanics;Optics,medium,120
                    </code>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Test</DialogTitle>
                  <DialogDescription>Record a new test result and track your performance</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-name">Test Name</Label>
                    <Input
                      id="test-name"
                      placeholder="e.g., Physics Mock Test 1"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.name}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="mock">Mock</SelectItem>
                          <SelectItem value="sectional">Sectional</SelectItem>
                          <SelectItem value="full">Full Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        type="number"
                        placeholder="85"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-marks">Total Marks</Label>
                      <Input
                        id="total-marks"
                        type="number"
                        placeholder="100"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topics">Topics (comma-separated)</Label>
                    <Textarea
                      id="topics"
                      placeholder="e.g., Mechanics, Optics, Thermodynamics"
                      value={formData.topics}
                      onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
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
                      <Label htmlFor="time-spent">Time Spent (minutes)</Label>
                      <Input
                        id="time-spent"
                        type="number"
                        placeholder="120"
                        value={formData.timeSpent}
                        onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTest}>Add Test</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tests.length}</div>
              <p className="text-xs text-muted-foreground">All time records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tests.length > 0
                  ? Math.round(
                      tests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / tests.length,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  tests.filter((test) => {
                    const testDate = new Date(test.date)
                    const now = new Date()
                    return testDate.getMonth() === now.getMonth() && testDate.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Tests completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(tests.reduce((sum, test) => sum + (test.timeSpent || 0), 0) / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">Total time spent</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Test Records</CardTitle>
            <CardDescription>View, filter, and manage all your test records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="mock">Mock</SelectItem>
                  <SelectItem value="sectional">Sectional</SelectItem>
                  <SelectItem value="full">Full Test</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tests Table */}
            <div className="rounded-md border">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => {
                          if (sortBy === "name") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          } else {
                            setSortBy("name")
                            setSortOrder("asc")
                          }
                        }}
                      >
                        Test Name
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => {
                          if (sortBy === "subject") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          } else {
                            setSortBy("subject")
                            setSortOrder("asc")
                          }
                        }}
                      >
                        Subject
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => {
                          if (sortBy === "score") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          } else {
                            setSortBy("score")
                            setSortOrder("desc")
                          }
                        }}
                      >
                        Score
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => {
                          if (sortBy === "date") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          } else {
                            setSortBy("date")
                            setSortOrder("desc")
                          }
                        }}
                      >
                        Date
                      </TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.name}</TableCell>
                        <TableCell>{test.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(test.category)}>
                            {test.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                            {test.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {test.score}/{test.totalMarks}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({Math.round((test.score / test.totalMarks) * 100)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(test.date).toLocaleDateString()}</TableCell>
                        <TableCell>{test.timeSpent ? `${test.timeSpent}m` : "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(test)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setDeletingTest(test)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Test</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{test.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteTest}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTests.length)} of {filteredTests.length} tests
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Test Dialog */}
        <Dialog open={!!editingTest} onOpenChange={(open) => !open && setEditingTest(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Test</DialogTitle>
              <DialogDescription>Update the test details and performance data</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-test-name">Test Name</Label>
                <Input
                  id="edit-test-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-subject">Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="mock">Mock</SelectItem>
                      <SelectItem value="sectional">Sectional</SelectItem>
                      <SelectItem value="full">Full Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-score">Score</Label>
                  <Input
                    id="edit-score"
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-total-marks">Total Marks</Label>
                  <Input
                    id="edit-total-marks"
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-topics">Topics (comma-separated)</Label>
                <Textarea
                  id="edit-topics"
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
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
                  <Label htmlFor="edit-time-spent">Time Spent (minutes)</Label>
                  <Input
                    id="edit-time-spent"
                    type="number"
                    value={formData.timeSpent}
                    onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTest(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditTest}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
