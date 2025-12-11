"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import { User, Bell, Shield, Download, Trash2, Save, Lock, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const { user, updateUser, clearAllData } = useStore()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    examType: user?.examType || "NEET",
    targetScore: user?.targetScore || 600,
  })
  const [notifications, setNotifications] = useState({
    testReminders: true,
    studyReminders: true,
    goalUpdates: true,
    weeklyReports: true,
  })
  const [issueType, setIssueType] = useState<"bug" | "feature" | "other">("bug")
  const [issueText, setIssueText] = useState("")
  const [issues, setIssues] = useState<{ id: string; type: string; text: string; date: string }[]>([])
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const handleSaveProfile = () => {
    updateUser(formData)
    toast.success("Profile updated successfully!")
  }

  const handleExportData = () => {
    const data = useStore.getState()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "scoretracker-data.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Data exported successfully!")
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData()
      toast.success("All data cleared successfully!")
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="surface surface-hover border border-foreground/10 dark:border-white/12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information and exam preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <Select
                  value={formData.examType}
                  onValueChange={(value) => setFormData({ ...formData, examType: value })}
                >
                  <SelectTrigger className="border border-foreground/15 dark:border-white/15 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-foreground/15 dark:border-white/15 shadow-lg">
                    <SelectItem value="NEET">NEET</SelectItem>
                    <SelectItem value="JEE">JEE</SelectItem>
                    <SelectItem value="UPSC">UPSC</SelectItem>
                    <SelectItem value="SSC">SSC</SelectItem>
                    <SelectItem value="GATE">GATE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetScore">Target Score</Label>
                <Input
                  id="targetScore"
                  type="number"
                  value={formData.targetScore}
                  onChange={(e) => setFormData({ ...formData, targetScore: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <Button onClick={handleSaveProfile} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="surface surface-hover border border-foreground/10 dark:border-white/12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified about upcoming scheduled tests</p>
                </div>
                <Switch
                  checked={notifications.testReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, testReminders: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified about scheduled study sessions</p>
                </div>
                <Switch
                  checked={notifications.studyReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, studyReminders: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Goal Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about goal progress and achievements</p>
                </div>
                <Switch
                  checked={notifications.goalUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, goalUpdates: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly performance summary reports</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface surface-hover border border-foreground/10 dark:border-white/12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription & Upgrade
            </CardTitle>
            <CardDescription>Compare plans and upgrade when you’re ready.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <div className="min-w-[640px] grid grid-cols-4 gap-4 text-sm">
                <div />
                <div className="text-center">
                  <div className="font-semibold">Free</div>
                  <div className="text-xs text-muted-foreground">₹0</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Pro</div>
                  <div className="text-xs text-muted-foreground">₹299/mo</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Premium</div>
                  <div className="text-xs text-muted-foreground">₹599/mo</div>
                </div>

                {[
                  "Unlimited Tests",
                  "Advanced Analytics",
                  "Calendar & Reminders",
                  "Export Reports (CSV/PDF)",
                  "Subject & Topic Manager",
                ].map((feature) => (
                  <div key={feature} className="contents">
                    <div className="py-2">{feature}</div>
                    <div className="py-2 text-center">
                      <Lock className="inline size-4 text-muted-foreground" aria-label="Locked on Free" />
                    </div>
                    <div className="py-2 text-center">
                      <span className="text-success font-medium">Included</span>
                    </div>
                    <div className="py-2 text-center">
                      <span className="text-success font-medium">Included</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">Upgrade</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upgrade Your Plan</DialogTitle>
                  <DialogDescription>Select a plan to unlock advanced features.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-between bg-transparent">
                    Pro <span className="text-muted-foreground">₹299/mo</span>
                  </Button>
                  <Button variant="outline" className="justify-between bg-transparent">
                    Premium <span className="text-muted-foreground">₹599/mo</span>
                  </Button>
                </div>
                <DialogFooter>
                  <Button onClick={() => setUpgradeOpen(false)}>Continue to Checkout</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="surface surface-hover border border-foreground/10 dark:border-white/12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>Export or clear your data. Use with caution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExportData} variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={handleClearData} variant="destructive" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Export Data:</strong> Download all your data as a JSON file for backup purposes.
              </p>
              <p>
                <strong>Clear All Data:</strong> Permanently delete all tests, subjects, and settings. This cannot be
                undone.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="surface surface-hover border border-foreground/10 dark:border-white/12">
          <CardHeader>
            <CardTitle>Issues & Feedback</CardTitle>
            <CardDescription>Report bugs or request features. Stored locally for now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Issue Type</Label>
                <Select value={issueType} onValueChange={(v: any) => setIssueType(v)}>
                  <SelectTrigger className="border border-foreground/15 dark:border-white/15 bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-foreground/15 dark:border-white/15 shadow-lg">
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the issue or request..."
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (!issueText.trim()) return
                  setIssues((prev) => [
                    {
                      id: crypto.randomUUID(),
                      type: issueType,
                      text: issueText.trim(),
                      date: new Date().toISOString(),
                    },
                    ...prev,
                  ])
                  setIssueText("")
                  toast.success("Thanks! Your feedback has been recorded.")
                }}
              >
                Submit
              </Button>
            </div>

            {issues.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  {issues.map((it) => (
                    <div key={it.id} className="flex items-start justify-between rounded-md border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {it.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{new Date(it.date).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-sm text-pretty">{it.text}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0"
                        onClick={() => setIssues((prev) => prev.filter((x) => x.id !== it.id))}
                        aria-label="Remove"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="surface surface-hover border border-foreground/10 dark:border-white/12">
          <CardHeader>
            <CardTitle>App Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Version</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Updated</span>
              <span className="text-sm text-muted-foreground">December 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Storage</span>
              <Badge variant="outline">Local Storage</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
