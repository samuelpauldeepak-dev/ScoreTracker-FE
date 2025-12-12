"use client"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileBarChart, Download, FileText, Calendar, Filter } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"

export default function ReportsPage() {
  const { tests, subjects, exams, activeExamId } = useAppStore()
  const activeExam = exams.find((e) => e.id === activeExamId)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const reports = [
    {
      id: "1",
      title: "Monthly Performance Report",
      description: "Comprehensive analysis of your performance in December 2024",
      date: "2024-12-01",
      type: "Performance",
      examId: activeExamId,
    },
    {
      id: "2",
      title: "Subject-wise Analysis",
      description: "Detailed breakdown of scores across all subjects",
      date: "2024-11-25",
      type: "Analysis",
      examId: activeExamId,
    },
    {
      id: "3",
      title: "Progress Report - Q4 2024",
      description: "Quarter 4 progress tracking and goal achievement",
      date: "2024-11-15",
      type: "Progress",
      examId: activeExamId,
    },
    {
      id: "4",
      title: "Weak Areas Identification",
      description: "Topics and subjects requiring more focus",
      date: "2024-11-10",
      type: "Analysis",
      examId: activeExamId,
    },
  ]

  const examTests = tests.filter((t) => t.examId === activeExamId)
  const totalReports = reports.length
  const recentReports = reports.filter((r) => new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
  const analysisReports = reports.filter((r) => r.type === "Analysis").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Reports & Insights</h1>
          <p className="text-muted-foreground text-balance">
            Comprehensive performance reports for {activeExam?.name || "your exams"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">Available reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentReports}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analysis Reports</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisReports}</div>
            <p className="text-xs text-muted-foreground">Deep dive reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Format</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PDF</div>
            <p className="text-xs text-muted-foreground">Default format</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Click on any report to view details and export options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileBarChart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(report.date), "MMM d, yyyy")}
                            </div>
                            <div className="px-2 py-0.5 bg-muted rounded">{report.type}</div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
