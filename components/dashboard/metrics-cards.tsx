"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, FileText, Award, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function MetricsCards() {
  const { tests, subjects } = useAppStore()

  // Calculate metrics
  const totalTests = tests.length
  const averageScore =
    tests.length > 0 ? Math.round(tests.reduce((sum, test) => sum + test.percentage, 0) / tests.length) : 0
  const bestScore = tests.length > 0 ? Math.max(...tests.map((test) => test.percentage)) : 0

  // Calculate improvement trend (compare last 3 tests with previous 3)
  const recentTests = tests.slice(-3)
  const previousTests = tests.slice(-6, -3)
  const recentAvg =
    recentTests.length > 0 ? recentTests.reduce((sum, test) => sum + test.percentage, 0) / recentTests.length : 0
  const previousAvg =
    previousTests.length > 0 ? previousTests.reduce((sum, test) => sum + test.percentage, 0) / previousTests.length : 0
  const improvementTrend = recentAvg - previousAvg

  const metrics = [
    {
      title: "Average Score",
      value: `${averageScore}%`,
      description: "Across all tests",
      icon: Target,
      trend: improvementTrend > 0 ? "up" : improvementTrend < 0 ? "down" : "neutral",
      trendValue: Math.abs(Math.round(improvementTrend)),
    },
    {
      title: "Best Score",
      value: `${bestScore}%`,
      description: "Personal record",
      icon: Award,
      trend: "neutral",
      trendValue: 0,
    },
    {
      title: "Total Tests",
      value: totalTests.toString(),
      description: "Tests completed",
      icon: FileText,
      trend: "neutral",
      trendValue: 0,
    },
    {
      title: "Active Subjects",
      value: subjects.length.toString(),
      description: "Subjects tracked",
      icon: Calendar,
      trend: "neutral",
      trendValue: 0,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{metric.description}</span>
              {metric.trend !== "neutral" && (
                <Badge variant={metric.trend === "up" ? "default" : "destructive"} className="gap-1">
                  {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {metric.trendValue}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
