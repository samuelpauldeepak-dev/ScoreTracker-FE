"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { SUBSCRIPTION_PLANS } from "@/lib/constants"
import {
  Camera,
  Award,
  Target,
  TrendingUp,
  Crown,
  Download,
  MapPin,
  GraduationCap,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, tests, subjects } = useAppStore()
  const { toast } = useToast()
  const [isPublic, setIsPublic] = useState(false)

  const plan = SUBSCRIPTION_PLANS[user?.subscription.planId || "FREE"]

  const stats = {
    totalTests: tests.length,
    averageScore:
      tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + (t.percentage || 0), 0) / tests.length) : 0,
    bestScore: tests.length > 0 ? Math.max(...tests.map((t) => t.percentage || 0)) : 0,
    studyStreak: 15,
  }

  const getAIRecommendations = () => {
    const recommendations = []

    if (stats.averageScore >= 80) {
      recommendations.push({
        type: "excellent",
        message: "Excellent performance! Focus on advanced problem-solving and time management to achieve 95%+ scores.",
      })
    } else if (stats.averageScore >= 60) {
      recommendations.push({
        type: "good",
        message: "Good progress! Increase daily study time by 30 minutes to push past 80%.",
      })
    } else {
      recommendations.push({
        type: "needs-work",
        message: "Build a strong foundation. Dedicate 2-3 hours daily to weak subjects for next 30 days.",
      })
    }

    if (stats.studyStreak >= 10) {
      recommendations.push({
        type: "streak",
        message: `Amazing ${stats.studyStreak}-day streak! Maintain consistency to build long-term habits.`,
      })
    }

    if (subjects.length < 3) {
      recommendations.push({
        type: "subjects",
        message: "Add more subjects to track comprehensive progress across your syllabus.",
      })
    }

    return recommendations
  }

  const aiRecommendations = getAIRecommendations()

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleDownloadProfile = () => {
    const profileData = {
      user,
      stats,
      plan: plan.name,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `venyto-profile-${user?.name?.replace(/\s+/g, "-")}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Profile Downloaded",
      description: "Your profile data has been downloaded as JSON.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Profile</h1>
          <p className="text-muted-foreground text-balance">Manage your account and view your achievements</p>
        </div>
        <Button variant="outline" onClick={handleDownloadProfile} className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Download Profile
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Plan</span>
                  <Badge className="gap-1">
                    <Crown className="h-3 w-3" />
                    {plan.name}
                  </Badge>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {user?.examPreferences?.map((exam) => (
                    <Badge key={exam} variant="secondary">
                      {exam}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalTests}</div>
              <p className="text-xs text-muted-foreground">Tests completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-600" />
                Best Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.bestScore}%</div>
              <p className="text-xs text-muted-foreground">Personal best</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.studyStreak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            AI Study Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions based on your performance and study patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-start gap-3 ${
                rec.type === "excellent"
                  ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  : rec.type === "good"
                    ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                    : rec.type === "streak"
                      ? "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
                      : "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
              }`}
            >
              <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">{rec.message}</p>
            </div>
          ))}
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              💡 Pro Tip: Review your Analytics page daily to track progress and adjust your study plan accordingly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" defaultValue={user?.name} placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" defaultValue={user?.email} placeholder="your.email@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Description</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your goals, and what you're preparing for..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input id="location" placeholder="City, State/Country" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </Label>
              <Input id="education" placeholder="e.g., 12th Grade, B.Sc. Student" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetExams" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Target Exams
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEET">NEET</SelectItem>
                  <SelectItem value="JEE">JEE</SelectItem>
                  <SelectItem value="UPSC">UPSC</SelectItem>
                  <SelectItem value="SSC">SSC</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects of Interest</Label>
            <Input id="subjects" placeholder="Physics, Chemistry, Biology (comma-separated)" />
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">Allow others to view your profile and shared reports</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Social Links (Optional)</Label>
            <div className="grid gap-3 md:grid-cols-2">
              <Input placeholder="LinkedIn profile URL" />
              <Input placeholder="Twitter/X handle" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSaveProfile}>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
