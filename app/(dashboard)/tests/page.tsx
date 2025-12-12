"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Upload, FileText, Filter } from "lucide-react"
import { AddTestForm } from "@/components/tests/add-test-form"
import { ImportTestsDialog } from "@/components/tests/import-tests-dialog"
import { TestHistoryTable } from "@/components/tests/test-history-table"
import { TestFilters } from "@/components/tests/test-filters"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SubscriptionLimitBanner } from "@/components/subscription-limit-banner"

export default function TestsPage() {
  const { tests } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [filters, setFilters] = useState({
    subject: "",
    category: "",
    dateRange: "",
    search: "",
  })

  // Calculate test statistics
  const totalTests = tests.length
  const averageScore =
    tests.length > 0 ? Math.round(tests.reduce((sum, test) => sum + test.percentage, 0) / tests.length) : 0
  const recentTests = tests.filter((test) => {
    const testDate = new Date(test.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return testDate >= weekAgo
  }).length

  const categoryStats = {
    mock: tests.filter((t) => t.category === "mock").length,
    practice: tests.filter((t) => t.category === "practice").length,
    sectional: tests.filter((t) => t.category === "sectional").length,
    full: tests.filter((t) => t.category === "full").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Test Management</h1>
          <p className="text-muted-foreground text-balance">
            Add, import, and manage your test results to track your performance
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Import Tests
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Test Results</DialogTitle>
              </DialogHeader>
              <ImportTestsDialog onClose={() => setShowImportDialog(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Test Result</DialogTitle>
              </DialogHeader>
              <AddTestForm onClose={() => setShowAddForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Subscription Limit Banner */}
      <SubscriptionLimitBanner type="tests" />

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">{recentTests} added this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <div className="h-4 w-4 rounded-full bg-chart-1"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mock Tests</CardTitle>
            <div className="h-4 w-4 rounded-full bg-chart-2"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats.mock}</div>
            <p className="text-xs text-muted-foreground">Full mock exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Tests</CardTitle>
            <div className="h-4 w-4 rounded-full bg-chart-3"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats.practice}</div>
            <p className="text-xs text-muted-foreground">Practice sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Test History</TabsTrigger>
          <TabsTrigger value="analytics">Category Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Test History</CardTitle>
                  <CardDescription>View and manage all your test results</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TestFilters filters={filters} onFiltersChange={setFilters} />
              <TestHistoryTable filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Categories</CardTitle>
                <CardDescription>Distribution of your test types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          category === "mock"
                            ? "bg-chart-1"
                            : category === "practice"
                              ? "bg-chart-2"
                              : category === "sectional"
                                ? "bg-chart-3"
                                : "bg-chart-4"
                        }`}
                      ></div>
                      <span className="capitalize">{category}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>Your last 5 test results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tests
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{test.name}</p>
                        <p className="text-xs text-muted-foreground">{test.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{test.percentage}%</p>
                        <p className="text-xs text-muted-foreground">
                          {test.score}/{test.totalMarks}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
