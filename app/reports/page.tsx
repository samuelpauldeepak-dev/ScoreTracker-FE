"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis } from "recharts"
import { Download, FileText, Printer, Award, TrendingUp, Target, BarChart3, FileSpreadsheet } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"

const chartConfig = {
  score: {
    label: "Score %",
    color: "hsl(var(--chart-1))",
  },
  physics: {
    label: "Physics",
    color: "hsl(var(--chart-1))",
  },
  chemistry: {
    label: "Chemistry",
    color: "hsl(var(--chart-2))",
  },
  biology: {
    label: "Biology",
    color: "hsl(var(--chart-3))",
  },
  mathematics: {
    label: "Mathematics",
    color: "hsl(var(--chart-4))",
  },
}

export default function ReportsPage() {
  const { tests, subjects, user } = useAppStore()
  const [selectedReportType, setSelectedReportType] = useState("performance")
  const [selectedTimeRange, setSelectedTimeRange] = useState("3months")
  const [selectedSubject, setSelectedSubject] = useState("all")

  // Filter tests based on time range
  const getFilteredTests = () => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (selectedTimeRange) {
      case "1month":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "3months":
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case "6months":
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return tests
    }

    let filtered = tests.filter((test) => new Date(test.date) >= cutoffDate)

    if (selectedSubject !== "all") {
      filtered = filtered.filter((test) => test.subject === selectedSubject)
    }

    return filtered
  }

  const filteredTests = getFilteredTests()

  // Generate report data
  const generateReportData = () => {
    const totalTests = filteredTests.length
    const averageScore =
      totalTests > 0
        ? Math.round(filteredTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / totalTests)
        : 0
    const bestScore =
      totalTests > 0 ? Math.max(...filteredTests.map((test) => Math.round((test.score / test.totalMarks) * 100))) : 0
    const worstScore =
      totalTests > 0 ? Math.min(...filteredTests.map((test) => Math.round((test.score / test.totalMarks) * 100))) : 0

    // Subject-wise performance
    const subjectPerformance = subjects.map((subject) => {
      const subjectTests = filteredTests.filter((test) => test.subject === subject.name)
      const avgScore =
        subjectTests.length > 0
          ? Math.round(
              subjectTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / subjectTests.length,
            )
          : 0
      return {
        name: subject.name,
        score: avgScore,
        tests: subjectTests.length,
        color: subject.color,
      }
    })

    // Performance over time
    const performanceOverTime = filteredTests
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((test, index) => ({
        test: `Test ${index + 1}`,
        score: Math.round((test.score / test.totalMarks) * 100),
        date: new Date(test.date).toLocaleDateString(),
        name: test.name,
      }))

    // Category performance
    const categoryPerformance = ["mock", "practice", "sectional", "full"].map((category) => {
      const categoryTests = filteredTests.filter((test) => test.category === category)
      const avgScore =
        categoryTests.length > 0
          ? Math.round(
              categoryTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / categoryTests.length,
            )
          : 0
      return {
        name: category,
        score: avgScore,
        count: categoryTests.length,
      }
    })

    return {
      summary: { totalTests, averageScore, bestScore, worstScore },
      subjectPerformance,
      performanceOverTime,
      categoryPerformance,
    }
  }

  const reportData = generateReportData()

  const exportToCSV = () => {
    const headers = ["Test Name", "Subject", "Category", "Score", "Total Marks", "Percentage", "Date", "Difficulty"]
    const csvContent = [
      headers.join(","),
      ...filteredTests.map((test) =>
        [
          `"${test.name}"`,
          test.subject,
          test.category,
          test.score,
          test.totalMarks,
          Math.round((test.score / test.totalMarks) * 100),
          test.date,
          test.difficulty,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `performance-report-${selectedTimeRange}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // Mock PDF generation - in a real app, you'd use a library like jsPDF
    const reportContent = `
      PERFORMANCE REPORT
      
      Student: ${user?.name}
      Period: ${selectedTimeRange}
      Generated: ${new Date().toLocaleDateString()}
      
      SUMMARY
      Total Tests: ${reportData.summary.totalTests}
      Average Score: ${reportData.summary.averageScore}%
      Best Score: ${reportData.summary.bestScore}%
      Worst Score: ${reportData.summary.worstScore}%
      
      SUBJECT PERFORMANCE
      ${reportData.subjectPerformance
        .map((subject) => `${subject.name}: ${subject.score}% (${subject.tests} tests)`)
        .join("\n")}
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `performance-report-${selectedTimeRange}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateCertificate = () => {
    // Mock certificate generation
    const certificateContent = `
      CERTIFICATE OF ACHIEVEMENT
      
      This is to certify that
      
      ${user?.name}
      
      has successfully completed ${reportData.summary.totalTests} tests
      with an average score of ${reportData.summary.averageScore}%
      
      Awarded on: ${new Date().toLocaleDateString()}
      
      ScoreTracker - Exam Analytics Platform
    `

    const blob = new Blob([certificateContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `certificate-${user?.name?.replace(/\s+/g, "-").toLowerCase()}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const printReport = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Performance Report - ${user?.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .metric { display: inline-block; margin: 10px 20px; text-align: center; }
              .metric-value { font-size: 24px; font-weight: bold; color: #0891b2; }
              .metric-label { font-size: 12px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Performance Report</h1>
              <p>Student: ${user?.name}</p>
              <p>Period: ${selectedTimeRange} | Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="summary">
              <h2>Summary</h2>
              <div class="metric">
                <div class="metric-value">${reportData.summary.totalTests}</div>
                <div class="metric-label">Total Tests</div>
              </div>
              <div class="metric">
                <div class="metric-value">${reportData.summary.averageScore}%</div>
                <div class="metric-label">Average Score</div>
              </div>
              <div class="metric">
                <div class="metric-value">${reportData.summary.bestScore}%</div>
                <div class="metric-label">Best Score</div>
              </div>
              <div class="metric">
                <div class="metric-value">${reportData.summary.worstScore}%</div>
                <div class="metric-label">Worst Score</div>
              </div>
            </div>
            
            <div class="section">
              <h2>Subject Performance</h2>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Average Score</th>
                    <th>Tests Taken</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportData.subjectPerformance
                    .map(
                      (subject) => `
                    <tr>
                      <td>${subject.name}</td>
                      <td>${subject.score}%</td>
                      <td>${subject.tests}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <h2>Recent Test Results</h2>
              <table>
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredTests
                    .slice(-10)
                    .map(
                      (test) => `
                    <tr>
                      <td>${test.name}</td>
                      <td>${test.subject}</td>
                      <td>${test.score}/${test.totalMarks} (${Math.round((test.score / test.totalMarks) * 100)}%)</td>
                      <td>${new Date(test.date).toLocaleDateString()}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Reports & Export</h1>
            <p className="text-muted-foreground">Generate detailed performance reports and export your data</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={generateCertificate}>
              <Award className="mr-2 h-4 w-4" />
              Certificate
            </Button>
            <Button variant="outline" onClick={printReport}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Customize your report parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance Report</SelectItem>
                    <SelectItem value="progress">Progress Report</SelectItem>
                    <SelectItem value="subject">Subject Analysis</SelectItem>
                    <SelectItem value="trends">Trend Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Filter</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Tabs value={selectedReportType} onValueChange={setSelectedReportType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="subject">Subject Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalTests}</div>
                  <p className="text-xs text-muted-foreground">In selected period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">Overall performance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.bestScore}%</div>
                  <p className="text-xs text-muted-foreground">Highest achievement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.performanceOverTime.length > 1
                      ? `+${reportData.performanceOverTime[reportData.performanceOverTime.length - 1].score - reportData.performanceOverTime[0].score}%`
                      : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Since first test</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Over Time</CardTitle>
                  <CardDescription>Your score progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <LineChart data={reportData.performanceOverTime}>
                      <XAxis dataKey="test" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-score)" }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={reportData.subjectPerformance}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="score" fill="var(--color-score)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
                <CardDescription>Your learning journey overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{reportData.summary.totalTests}</div>
                      <div className="text-sm text-muted-foreground">Tests Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{subjects.length}</div>
                      <div className="text-sm text-muted-foreground">Subjects Studied</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(tests.reduce((sum, test) => sum + (test.timeSpent || 0), 0) / 60)}h
                      </div>
                      <div className="text-sm text-muted-foreground">Study Time</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Subject Progress</h4>
                    {subjects.map((subject) => {
                      const subjectTests = tests.filter((test) => test.subject === subject.name)
                      const avgScore =
                        subjectTests.length > 0
                          ? Math.round(
                              subjectTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) /
                                subjectTests.length,
                            )
                          : 0

                      return (
                        <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }} />
                            <span className="font-medium">{subject.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{subjectTests.length} tests</Badge>
                            <span className="text-sm font-medium">{avgScore}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subject" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Distribution</CardTitle>
                  <CardDescription>Test count by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={reportData.subjectPerformance}
                        dataKey="tests"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="var(--color-score)"
                      >
                        {reportData.subjectPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Performance by test type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={reportData.categoryPerformance}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="score" fill="var(--color-score)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Subject Analysis</CardTitle>
                <CardDescription>Comprehensive breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.subjectPerformance.map((subject) => (
                    <div key={subject.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span>{subject.name}</span>
                        </h4>
                        <Badge variant="outline">{subject.tests} tests</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{subject.score}%</div>
                          <div className="text-xs text-muted-foreground">Average Score</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{subject.tests}</div>
                          <div className="text-xs text-muted-foreground">Tests Taken</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {subject.score >= 80 ? "A" : subject.score >= 70 ? "B" : subject.score >= 60 ? "C" : "D"}
                          </div>
                          <div className="text-xs text-muted-foreground">Grade</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Analyze your improvement patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">↗</div>
                      <div className="text-sm font-medium">Improving</div>
                      <div className="text-xs text-muted-foreground">Overall trend</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">7</div>
                      <div className="text-sm font-medium">Day Streak</div>
                      <div className="text-xs text-muted-foreground">Study consistency</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">85%</div>
                      <div className="text-sm font-medium">Best Month</div>
                      <div className="text-xs text-muted-foreground">Peak performance</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm font-medium">Weak Areas</div>
                      <div className="text-xs text-muted-foreground">Need attention</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Key Insights</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <h5 className="text-sm font-medium text-green-900 dark:text-green-100">Strengths</h5>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Consistent performance in Mathematics with 90% average score. Strong improvement in Biology
                          over the last month.
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                        <h5 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                          Areas for Improvement
                        </h5>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Physics scores show high variability. Consider focusing more time on fundamental concepts.
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">Recommendations</h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Maintain current study schedule. Consider taking more mock tests to improve exam performance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
