import { type NextRequest, NextResponse } from "next/server"
import { mockTests, mockSubjects, mockStudySessions, mockGoals, simulateDelay } from "../../_mock-data"

// GET /api/analytics/dashboard - Get aggregated dashboard stats
export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"

    const userTests = mockTests.filter((t) => t.userId === userId)
    const userSubjects = mockSubjects.filter((s) => s.userId === userId)
    const userSessions = mockStudySessions.filter((s) => s.userId === userId)
    const userGoals = mockGoals.filter((g) => g.userId === userId)

    // Calculate metrics
    const totalTests = userTests.length
    const averageScore =
      totalTests > 0 ? Math.round(userTests.reduce((sum, t) => sum + t.percentage, 0) / totalTests) : 0
    const bestScore = totalTests > 0 ? Math.max(...userTests.map((t) => t.percentage)) : 0

    // 30-day trend
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentTests = userTests.filter((t) => new Date(t.date) >= thirtyDaysAgo)
    const olderTests = userTests.filter((t) => {
      const testDate = new Date(t.date)
      const sixtyDaysAgo = new Date()
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
      return testDate >= sixtyDaysAgo && testDate < thirtyDaysAgo
    })

    const recentAvg =
      recentTests.length > 0 ? recentTests.reduce((sum, t) => sum + t.percentage, 0) / recentTests.length : 0
    const olderAvg =
      olderTests.length > 0 ? olderTests.reduce((sum, t) => sum + t.percentage, 0) / olderTests.length : 0
    const trend = olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0

    // Total study hours
    const totalStudyHours = Math.round(userSessions.reduce((sum, s) => sum + s.durationMins, 0) / 60)

    // Subject performance
    const subjectPerformance = userSubjects.map((subject) => {
      const subjectTests = userTests.filter((t) => t.subjectId === subject.id)
      const avg =
        subjectTests.length > 0
          ? Math.round(subjectTests.reduce((sum, t) => sum + t.percentage, 0) / subjectTests.length)
          : 0
      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        averageScore: avg,
        testCount: subjectTests.length,
      }
    })

    // Active goals
    const activeGoals = userGoals.filter((g) => g.status === "active")

    // Recent tests (last 5)
    const recentTestsList = [...userTests]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    // Weekly performance data for chart
    const weeklyData = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (7 - i) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const weekTests = userTests.filter((t) => {
        const testDate = new Date(t.date)
        return testDate >= weekStart && testDate < weekEnd
      })

      return {
        week: `Week ${i + 1}`,
        date: weekStart.toISOString().split("T")[0],
        averageScore:
          weekTests.length > 0
            ? Math.round(weekTests.reduce((sum, t) => sum + t.percentage, 0) / weekTests.length)
            : null,
        testCount: weekTests.length,
      }
    })

    return NextResponse.json({
      data: {
        metrics: {
          totalTests,
          averageScore,
          bestScore,
          trend,
          totalStudyHours,
        },
        subjectPerformance,
        activeGoals,
        recentTests: recentTestsList,
        weeklyData,
      },
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
