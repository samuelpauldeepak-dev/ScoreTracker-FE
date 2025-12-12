"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, TrendingUp, Zap } from "lucide-react"

export function PerformancePredictions() {
  const { tests, user } = useAppStore()

  // Calculate predictions based on recent performance
  const recentTests = tests.slice(-5) // Last 5 tests
  const averageRecent =
    recentTests.length > 0 ? recentTests.reduce((sum, test) => sum + test.percentage, 0) / recentTests.length : 0

  // Mock AI predictions based on performance trends
  const predictions = [
    {
      exam: "NEET 2024",
      predictedScore: Math.min(100, Math.round(averageRecent + 5)),
      confidence: 85,
      trend: "improving",
      icon: Target,
    },
    {
      exam: "JEE Main",
      predictedScore: Math.min(100, Math.round(averageRecent + 2)),
      confidence: 78,
      trend: "stable",
      icon: Zap,
    },
  ]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "improving":
        return (
          <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
            <TrendingUp className="h-3 w-3" />
            Improving
          </Badge>
        )
      case "stable":
        return <Badge variant="secondary">Stable</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.examPreferences?.map((examType) => {
          const prediction = predictions.find((p) => p.exam.includes(examType)) || predictions[0]
          return (
            <div key={examType} className="space-y-3 p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <prediction.icon className="h-4 w-4" />
                  <span className="font-medium">{examType}</span>
                </div>
                {getTrendBadge(prediction.trend)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Predicted Score</span>
                  <span className="font-medium">{prediction.predictedScore}%</span>
                </div>
                <Progress value={prediction.predictedScore} className="h-2" />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}%
                </span>
              </div>
            </div>
          )
        }) || (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              Set your exam preferences in profile to see personalized predictions
            </p>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            🤖 Predictions based on your recent performance trends and study patterns
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
