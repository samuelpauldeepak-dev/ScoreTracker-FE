"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis } from "recharts"
import PieChart from "@/components/charts/pie-chart"
import { Calendar, TrendingUp, Trophy, Target, Plus, BookOpen, TestTube } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-2))",
  },
}

export default function DashboardPage() {
  const { user, tests, subjects } = useAppStore()

  // Calculate dashboard metrics
  const totalTests = tests.length
  const averageScore =
    tests.length > 0
      ? Math.round(tests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / tests.length)
      : 0
  const bestScore =
    tests.length > 0 ? Math.max(...tests.map((test) => Math.round((test.score / test.totalMarks) * 100))) : 0
  const recentTests = tests.slice(-5).reverse()

  // Chart data for recent performance
  const performanceData = tests.slice(-7).map((test, index) => ({
    name: `Test ${index + 1}`,
    score: Math.round((test.score / test.totalMarks) * 100),
    date: new Date(test.date).toLocaleDateString(),
  }))

  // Subject performance data
  const subjectData = subjects.map((subject) => {
    const subjectTests = tests.filter((test) => test.subject === subject.name)
    const avgScore =
      subjectTests.length > 0
        ? Math.round(
            subjectTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / subjectTests.length,
          )
        : 0
    return {
      name: subject.name,
      score: avgScore,
      color: subject.color,
    }
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
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
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Here's your exam performance overview and recent activity.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestScore}%</div>
              <p className="text-xs text-muted-foreground">Personal best this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">Since last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Performance Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>Your score progression over the last 7 tests</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig}>
                <LineChart data={performanceData}>
                  <XAxis dataKey="name" />
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

          {/* Subject Performance */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={subjectData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="var(--color-score)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Tests */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Tests</CardTitle>
              <CardDescription>Your latest test results and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{test.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getCategoryColor(test.category)}>
                          {test.category}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                          {test.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {test.score}/{test.totalMarks}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((test.score / test.totalMarks) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
                {recentTests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No tests recorded yet. Add your first test to get started!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Progress */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and progress overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Button className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Test
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Study Session
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Review Subjects
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Weekly Goal</span>
                    <span>3/5 tests</span>
                  </div>
                  <Progress value={60} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Study Streak</span>
                    <span>7 days</span>
                  </div>
                  <Progress value={100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Chart Card */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Accuracy Distribution</CardTitle>
              <CardDescription>Correct vs. incorrect vs. unattempted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <PieChart />
              </div>
            </CardContent>
          </Card>
          {/* Placeholder for another card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Placeholder Card</CardTitle>
              <CardDescription>This is a placeholder card</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">More content can be added here.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Card */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>AI-powered analysis of your exam preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Strengths</h4>
                <p className="text-sm text-muted-foreground">
                  You're performing exceptionally well in Mathematics and Biology. Keep up the consistent practice!
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Areas to Focus</h4>
                <p className="text-sm text-muted-foreground">
                  Physics shows room for improvement. Consider spending more time on Electromagnetism topics.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Prediction</h4>
                <p className="text-sm text-muted-foreground">
                  Based on your current trajectory, you're on track to achieve 78% in your next full mock test.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
