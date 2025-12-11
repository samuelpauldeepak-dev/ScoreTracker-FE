"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { Trophy, Target, Calendar, BookOpen, TrendingUp, Award, Edit } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, tests, subjects, goals } = useStore()

  const totalTests = tests.length
  const averageScore =
    tests.length > 0 ? Math.round(tests.reduce((sum, test) => sum + test.score, 0) / tests.length) : 0
  const bestScore = tests.length > 0 ? Math.max(...tests.map((test) => test.score)) : 0
  const completedSubjects = subjects.filter((s) => s.progress >= 100).length
  const currentGoal = goals.find((g) => g.status === "active")
  const goalProgress = currentGoal ? (currentGoal.currentValue / currentGoal.targetValue) * 100 : 0

  const achievements = [
    { name: "First Test", description: "Completed your first test", earned: totalTests > 0 },
    { name: "High Scorer", description: "Scored above 80%", earned: bestScore > 80 },
    { name: "Consistent", description: "Took 10 tests", earned: totalTests >= 10 },
    { name: "Subject Master", description: "Completed a subject", earned: completedSubjects > 0 },
    { name: "Goal Achiever", description: "Achieved a goal", earned: goals.some((g) => g.status === "completed") },
  ]

  const earnedAchievements = achievements.filter((a) => a.earned)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Your academic journey and achievements.</p>
        </div>
        <Button asChild>
          <Link href="/settings">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Profile Overview */}
        <Card className="surface surface-hover">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{user?.name?.charAt(0) || "U"}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{user?.name || "User"}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{user?.examType || "NEET"}</Badge>
                  <Badge variant="outline">Target: {user?.targetScore || 600}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">Tests completed</p>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestScore}%</div>
              <p className="text-xs text-muted-foreground">Personal best</p>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedSubjects}/{subjects.length}
              </div>
              <p className="text-xs text-muted-foreground">Completed subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Goal */}
        {currentGoal && (
          <Card className="surface surface-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Current Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{currentGoal.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {currentGoal.currentValue}/{currentGoal.targetValue}
                  </span>
                </div>
                <Progress value={goalProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{Math.round(goalProgress)}% complete</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        <Card className="surface surface-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    achievement.earned ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {earnedAchievements.length} of {achievements.length} achievements earned
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="surface surface-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.slice(0, 5).map((test, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{test.testName}</p>
                    <p className="text-sm text-muted-foreground">
                      {test.subject} • {new Date(test.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={test.score >= 80 ? "default" : test.score >= 60 ? "secondary" : "destructive"}>
                    {test.score}%
                  </Badge>
                </div>
              ))}
              {tests.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No tests taken yet. Start by adding your first test!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
