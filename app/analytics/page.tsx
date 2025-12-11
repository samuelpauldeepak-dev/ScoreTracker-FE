"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Target, AlertTriangle, Download } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

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

export default function AnalyticsPage() {
  const { tests, subjects } = useAppStore()
  const [timeRange, setTimeRange] = useState("3months")

  // Filter tests based on time range
  const getFilteredTests = () => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (timeRange) {
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

    return tests.filter((test) => new Date(test.date) >= cutoffDate)
  }

  const filteredTests = getFilteredTests()

  // Score progression over time
  const progressionData = filteredTests
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((test, index) => ({
      date: new Date(test.date).toLocaleDateString(),
      score: Math.round((test.score / test.totalMarks) * 100),
      test: test.name,
      subject: test.subject,
    }))

  // Subject-wise performance
  const subjectPerformance = subjects.map((subject) => {
    const subjectTests = filteredTests.filter((test) => test.subject === subject.name)
    const scores = subjectTests.map((test) => (test.score / test.totalMarks) * 100)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0
    const bestScore = scores.length > 0 ? Math.round(Math.max(...scores)) : 0
    const worstScore = scores.length > 0 ? Math.round(Math.min(...scores)) : 0
    const improvement = scores.length > 1 ? Math.round(scores[scores.length - 1] - scores[0]) : 0

    return {
      name: subject.name,
      average: avgScore,
      best: bestScore,
      worst: worstScore,
      improvement,
      testsCount: subjectTests.length,
      color: subject.color,
    }
  })

  // Category performance
  const categoryData = ["mock", "practice", "sectional", "full"].map((category) => {
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

  // Difficulty analysis
  const difficultyData = ["easy", "medium", "hard"].map((difficulty) => {
    const difficultyTests = filteredTests.filter((test) => test.difficulty === difficulty)
    const avgScore =
      difficultyTests.length > 0
        ? Math.round(
            difficultyTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) /
              difficultyTests.length,
          )
        : 0
    return {
      name: difficulty,
      score: avgScore,
      count: difficultyTests.length,
    }
  })

  // Weekly performance
  const weeklyData = (() => {
    const weeks = {}
    filteredTests.forEach((test) => {
      const date = new Date(test.date)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weeks[weekKey]) {
        weeks[weekKey] = { tests: [], scores: [] }
      }
      weeks[weekKey].tests.push(test)
      weeks[weekKey].scores.push((test.score / test.totalMarks) * 100)
    })

    return Object.entries(weeks)
      .map(([week, data]) => ({
        week: new Date(week).toLocaleDateString(),
        averageScore: Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length),
        testsCount: data.tests.length,
      }))
      .slice(-8) // Last 8 weeks
  })()

  const overallStats = {
    totalTests: filteredTests.length,
    averageScore:
      filteredTests.length > 0
        ? Math.round(
            filteredTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / filteredTests.length,
          )
        : 0,
    bestScore:
      filteredTests.length > 0
        ? Math.max(...filteredTests.map((test) => Math.round((test.score / test.totalMarks) * 100)))
        : 0,
    improvement:
      progressionData.length > 1 ? progressionData[progressionData.length - 1].score - progressionData[0].score : 0,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into your exam performance and progress</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Analyzed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalTests}</div>
              <p className="text-xs text-muted-foreground">In selected time range</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.bestScore}%</div>
              <p className="text-xs text-muted-foreground">Highest score achieved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Trend</CardTitle>
              {overallStats.improvement >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overallStats.improvement >= 0 ? "+" : ""}
                {overallStats.improvement}%
              </div>
              <p className="text-xs text-muted-foreground">Since first test</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="progression" className="space-y-4">
          <TabsList>
            <TabsTrigger value="progression">Score Progression</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="patterns">Performance Patterns</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="progression" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Score Progression Over Time</CardTitle>
                  <CardDescription>Track your performance improvement across all tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={progressionData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        fill="var(--color-score)"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Trends</CardTitle>
                  <CardDescription>Average scores and test frequency by week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="averageScore" fill="var(--color-score)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance Comparison</CardTitle>
                  <CardDescription>Average scores across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={subjectPerformance}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="average" fill="var(--color-score)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Distribution</CardTitle>
                  <CardDescription>Test count by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={subjectPerformance}
                        dataKey="testsCount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="var(--color-score)"
                      >
                        {subjectPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Subject Analysis</CardTitle>
                <CardDescription>Comprehensive breakdown of performance by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectPerformance.map((subject) => (
                    <div key={subject.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{subject.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{subject.testsCount} tests</Badge>
                          <Badge
                            variant="outline"
                            className={subject.improvement >= 0 ? "text-green-600" : "text-red-600"}
                          >
                            {subject.improvement >= 0 ? "+" : ""}
                            {subject.improvement}% trend
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold">{subject.average}%</div>
                        <div className="text-xs text-muted-foreground">
                          Best: {subject.best}% | Worst: {subject.worst}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Test Category</CardTitle>
                  <CardDescription>How you perform in different types of tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={categoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="score" fill="var(--color-score)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance by Difficulty</CardTitle>
                  <CardDescription>Your scores across different difficulty levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={difficultyData}>
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

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Strengths & Opportunities</CardTitle>
                  <CardDescription>AI-powered analysis of your performance patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Consistent performance in Mathematics (90% average)</li>
                      <li>• Strong improvement trend in Biology (+15% over time)</li>
                      <li>• Excellent performance in easy-medium difficulty tests</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Areas for Improvement
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Physics scores show high variability (45-78%)</li>
                      <li>• Performance drops significantly in hard difficulty tests</li>
                      <li>• Mock test scores are below practice test averages</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Personalized suggestions to improve your performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Focus Areas</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Dedicate 40% more time to Physics, especially Electromagnetism and Thermodynamics topics.
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="text-sm font-medium text-green-900 dark:text-green-100">Study Strategy</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Take more mock tests to bridge the gap between practice and exam performance.
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">Goal Setting</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Aim for 75% average in next month's tests. You're currently at 72% - very achievable!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
