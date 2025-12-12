"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown } from "lucide-react"

export function WeakAreasAnalysis() {
  const { tests, subjects } = useAppStore()

  // Calculate weak areas based on subject performance
  const subjectAnalysis = subjects.map((subject) => {
    const subjectTests = tests.filter((test) => test.subject === subject.name)
    const averageScore =
      subjectTests.length > 0 ? subjectTests.reduce((sum, test) => sum + test.percentage, 0) / subjectTests.length : 0

    return {
      name: subject.name,
      averageScore: Math.round(averageScore),
      testsCount: subjectTests.length,
      icon: subject.icon,
      color: subject.color,
    }
  })

  // Sort by lowest scores to identify weak areas
  const weakAreas = subjectAnalysis
    .filter((subject) => subject.testsCount > 0) // Only include subjects with tests
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3) // Top 3 weak areas

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-600" }
    if (score >= 70) return { level: "Good", color: "text-blue-600" }
    if (score >= 60) return { level: "Average", color: "text-yellow-600" }
    return { level: "Needs Improvement", color: "text-red-600" }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Areas for Improvement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weakAreas.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">Complete more tests to see detailed analysis</p>
        ) : (
          weakAreas.map((area, index) => {
            const performance = getPerformanceLevel(area.averageScore)
            return (
              <div key={area.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{area.icon}</span>
                    <span className="font-medium">{area.name}</span>
                    {index === 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <TrendingDown className="h-3 w-3" />
                        Priority
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{area.averageScore}%</p>
                    <p className={`text-xs ${performance.color}`}>{performance.level}</p>
                  </div>
                </div>
                <Progress value={area.averageScore} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on {area.testsCount} test{area.testsCount !== 1 ? "s" : ""}
                </p>
              </div>
            )
          })
        )}

        {weakAreas.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              💡 Focus on these subjects in your next study sessions for maximum improvement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
