"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Bell, Shield, Database, Crown, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { SUBSCRIPTION_PLANS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { UpgradeDialog } from "@/components/upgrade-dialog"
import { useSearchParams } from "next/navigation"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, getUsage } = useAppStore()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const searchParams = useSearchParams()
  const activeTab = searchParams?.get("tab")

  const plan = SUBSCRIPTION_PLANS[user?.subscription.planId || "FREE"]
  const usage = getUsage()

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === Number.POSITIVE_INFINITY) return 0
    return Math.min((current / limit) * 100, 100)
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground text-balance">Manage your preferences and account settings</p>
        </div>

        <div className="grid gap-6">
          <Card className={activeTab === "subscription" ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Subscription & Plan
              </CardTitle>
              <CardDescription>Manage your VENYTO subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-1">
                    {plan.currency}
                    {plan.price}
                    {plan.price > 0 && <span className="text-base font-normal text-muted-foreground">/month</span>}
                  </p>
                </div>
                <Button onClick={() => setShowUpgradeDialog(true)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>

              {/* Usage Stats */}
              <div className="space-y-4">
                <h4 className="font-medium">Usage This Month</h4>

                <div className="space-y-3">
                  {/* Exams Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Exams</span>
                      <span className="font-medium">
                        {usage.exams} / {plan.limits.exams === Number.POSITIVE_INFINITY ? "∞" : plan.limits.exams}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage(usage.exams, plan.limits.exams)} className="h-2" />
                  </div>

                  {/* Tests Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tests</span>
                      <span className="font-medium">
                        {usage.tests} / {plan.limits.tests === Number.POSITIVE_INFINITY ? "∞" : plan.limits.tests}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage(usage.tests, plan.limits.tests)} className="h-2" />
                  </div>

                  {/* Subjects Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subjects</span>
                      <span className="font-medium">
                        {usage.subjects} /{" "}
                        {plan.limits.subjects === Number.POSITIVE_INFINITY ? "∞" : plan.limits.subjects}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage(usage.subjects, plan.limits.subjects)} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-medium">Plan Features</h4>
                <div className="grid gap-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how VENYTO looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified about upcoming tests</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance Updates</Label>
                  <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Study Streak</Label>
                  <p className="text-sm text-muted-foreground">Daily study streak reminders</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Export Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <UpgradeDialog open={showUpgradeDialog} onClose={() => setShowUpgradeDialog(false)} />
    </>
  )
}
