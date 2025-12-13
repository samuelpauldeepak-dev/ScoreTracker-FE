"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { GraduationCap, TrendingUp, Calendar, BarChart3 } from "lucide-react"

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAppStore()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      login({
        id: "1",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        avatar: "/student-avatar.png",
        examPreferences: ["NEET", "JEE"],
        joinedDate: new Date().toISOString().split("T")[0],
      })
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      login({
        id: "1",
        name: "New Student",
        email: "student@email.com",
        examPreferences: ["NEET"],
        joinedDate: new Date().toISOString().split("T")[0],
      })
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-12 px-10 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <span className="text-xl md:text-2xl lg:text-3xl font-bold">Venyto</span>
          </div>

          {/* Hero Content */}
          <div className="space-y-2">
            <h1 className="text-5xl font-bold leading-tight text-balance">Master Your Competitive Exams</h1>
            <p className="text-xl text-blue-100 leading-relaxed text-balance max-w-md">
              Intelligent performance analytics, personalized insights, and goal tracking designed for serious exam
              aspirants.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Performance Analytics</p>
                <p className="text-sm text-blue-100">Real-time tracking with AI-powered insights</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Subject-wise Breakdown</p>
                <p className="text-sm text-blue-100">Identify weak areas and improve faster</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Smart Study Planning</p>
                <p className="text-sm text-blue-100">Organize schedules and hit your goals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial or Stats */}
        <div className="relative z-10 space-y-3 mt-4">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold">15K+</p>
              <p className="text-sm text-blue-100">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-blue-100">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold">5M+</p>
              <p className="text-sm text-blue-100">Tests Tracked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2 bg-primary rounded-xl">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">ScoreTracker</span>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-balance">Welcome</h2>
            <p className="text-muted-foreground text-balance">
              Sign in to your account or create a new one to start tracking your exam performance
            </p>
          </div>

          {/* Auth Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="login" className="text-base">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-base">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-5 mt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="priya.sharma@email.com"
                    defaultValue="priya.sharma@email.com"
                    className="h-12 text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-base">
                      Password
                    </Label>
                    <button type="button" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    defaultValue="password123"
                    className="h-12 text-base"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo credentials</span>
                </div>
              </div>

              <div className="text-sm text-center text-muted-foreground bg-muted p-4 rounded-lg">
                <p className="font-medium">Use demo account:</p>
                <p className="mt-1">priya.sharma@email.com / password123</p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-5 mt-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Full Name
                  </Label>
                  <Input id="name" type="text" placeholder="Enter your full name" className="h-12 text-base" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-base">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="h-12 text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-base">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password"
                    className="h-12 text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {/* Additional Features for Mobile */}
          <div className="lg:hidden pt-8 border-t space-y-4">
            <p className="text-sm font-medium text-center">Trusted by thousands of exam aspirants</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">15K+</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-xs text-muted-foreground">Success</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">5M+</p>
                <p className="text-xs text-muted-foreground">Tests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
