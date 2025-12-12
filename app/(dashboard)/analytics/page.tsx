"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Target, Award, Calendar, TrendingDown } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/50 rounded-lg shadow-xl px-3 py-2">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { tests, subjects, exams, activeExamId } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const examTests = activeExamId ? tests.filter((t) => t.examId === activeExamId) : tests

  const subjectMap = new Map(subjects.map((s) => [s.name, s]))

  // Weekly improvement tracking
  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const week = i + 1
    const weekTests = examTests.filter((_, idx) => Math.floor(idx / 3) === i).slice(0, 3)
    const avgScore = weekTests.length > 0 ? weekTests.reduce((sum, t) => sum + t.percentage, 0) / weekTests.length : 0
    return {
      week: `Week ${week}`,
      score: Math.round(avgScore),
      tests: weekTests.length,
    }
  })

  const subjectConsistency = subjects
    .filter((subject) => subject?.id && subject?.name)
    .map((subject) => {
      const subjectTests = examTests.filter((t) => t.subject === subject.name)
      const scores = subjectTests.map((t) => t.percentage)
      const avg = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
      const stdDev =
        scores.length > 0 ? Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length) : 0
      return {
        name: subject.name,
        consistency: Math.round(100 - Math.min(stdDev, 100)),
        average: Math.round(avg),
        tests: subjectTests.length,
      }
    })
    .filter((s) => s.tests > 0)
    .sort((a, b) => b.consistency - a.consistency)

  const improvementRate =
    weeklyData.length > 1 && weeklyData[0].score > 0
      ? ((weeklyData[weeklyData.length - 1].score - weeklyData[0].score) / weeklyData[0].score) * 100
      : 0

  const mostConsistentSubject = subjectConsistency[0]?.name || "N/A"
  const studyStreak = 15
  const accuracyRate =
    examTests.length > 0 ? Math.round(examTests.reduce((sum, t) => sum + t.percentage, 0) / examTests.length) : 0

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-balance">Deep Analytics</h1>
        <p className="text-muted-foreground text-balance">
          Advanced insights, consistency tracking, and improvement patterns
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
          <TabsTrigger value="consistency">Consistency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {improvementRate >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  Improvement Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${improvementRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {improvementRate >= 0 ? "+" : ""}
                  {Math.round(improvementRate)}%
                </div>
                <p className="text-xs text-muted-foreground">Last 12 weeks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Accuracy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracyRate}%</div>
                <p className="text-xs text-muted-foreground">Across all tests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  Most Consistent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">{mostConsistentSubject}</div>
                <p className="text-xs text-muted-foreground">Lowest score variation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studyStreak} days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>12-Week Progress Analysis</CardTitle>
              <CardDescription>Track your score trends and test frequency over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Average Score",
                    color: "hsl(var(--chart-1))",
                  },
                  tests: {
                    label: "Tests Taken",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-score)"
                      name="Average Score %"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tests"
                      stroke="var(--color-tests)"
                      name="Tests Taken"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
              <CardDescription>Detailed breakdown of your weekly score progression</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Score",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" fill="var(--color-score)" name="Average Score %" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consistency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Consistency Ranking</CardTitle>
              <CardDescription>Subjects with lowest score variation perform best</CardDescription>
            </CardHeader>
            <CardContent>
              {subjectConsistency.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No subject data available yet.</p>
                  <p className="text-sm">Add subjects and take tests to see consistency rankings.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subjectConsistency.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.consistency}% consistent</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${item.consistency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
