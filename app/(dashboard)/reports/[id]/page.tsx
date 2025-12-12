"use client"

import { use } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Download,
  Maximize2,
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tests, subjects } = useAppStore()

  const report = {
    id,
    title: "Monthly Performance Report",
    description: "Comprehensive analysis of your performance in December 2024",
    date: "2024-12-01",
    type: "Performance",
    generatedAt: new Date().toISOString(),
  }

  const averageScore = tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + t.percentage, 0) / tests.length) : 0
  const bestScore = tests.length > 0 ? Math.max(...tests.map((t) => t.percentage)) : 0
  const worstScore = tests.length > 0 ? Math.min(...tests.map((t) => t.percentage)) : 0

  const subjectPerformance = subjects.map((subject) => {
    const subjectTests = tests.filter((t) => t.subject === subject.name)
    const avg =
      subjectTests.length > 0 ? subjectTests.reduce((sum, t) => sum + t.percentage, 0) / subjectTests.length : 0
    return {
      ...subject,
      averageScore: Math.round(avg),
      testsCount: subjectTests.length,
    }
  })

  const strengths = subjectPerformance.filter((s) => s.averageScore >= 80).slice(0, 3)
  const weaknesses = subjectPerformance.filter((s) => s.averageScore < 70).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileBarChart className="h-5 w-5 text-primary" />
                <Badge>{report.type}</Badge>
              </div>
              <CardTitle className="text-2xl mb-2">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t">
            <span>Report Date: {format(new Date(report.date), "MMMM d, yyyy")}</span>
            <span>•</span>
            <span>Generated: {format(new Date(report.generatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            AI Report Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <p>
              <strong>Overall Assessment:</strong>{" "}
              {averageScore >= 80
                ? "Excellent progress! You're performing consistently well across most subjects."
                : averageScore >= 60
                  ? "Good performance with room for targeted improvement in specific areas."
                  : "Consider revisiting study strategies and increasing practice frequency."}
            </p>
            <p>
              <strong>Key Highlight:</strong> Your best subject scored {bestScore}%, showing strong understanding and
              consistent practice habits.
            </p>
            <p>
              <strong>Action Items:</strong>
            </p>
            <ul className="ml-6 space-y-1 list-disc text-muted-foreground">
              <li>Focus on subjects scoring below 70% - allocate 30% more study time</li>
              <li>Review incorrect answers from recent tests to identify pattern gaps</li>
              <li>Maintain consistency in high-performing subjects through weekly practice</li>
              <li>Schedule at least 2 mock tests per week to build exam confidence</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bestScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Personal best this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{worstScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Room for improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
          <CardDescription>Detailed breakdown of your scores across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.icon}
                    </div>
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.testsCount} tests taken</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{subject.averageScore}%</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                </div>
                <Progress value={subject.averageScore} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Your Strengths
            </CardTitle>
            <CardDescription>Subjects where you excel</CardDescription>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span>{subject.icon}</span>
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {subject.averageScore}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Keep practicing to identify your strengths
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>Subjects that need more focus</CardDescription>
          </CardHeader>
          <CardContent>
            {weaknesses.length > 0 ? (
              <div className="space-y-3">
                {weaknesses.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span>{subject.icon}</span>
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {subject.averageScore}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Great job! No major weaknesses identified
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
