"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ExamSwitcher } from "@/components/exam-switcher"

export function DashboardHeader() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />

        <div className="flex-1 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tests, subjects, or topics..." className="pl-9" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExamSwitcher />

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <h4 className="font-medium mb-2">Notifications</h4>
                <div className="space-y-2">
                  <DropdownMenuItem className="flex-col items-start p-3">
                    <div className="font-medium">NEET Mock Test 2 Tomorrow</div>
                    <div className="text-sm text-muted-foreground">Scheduled for 10:00 AM</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start p-3">
                    <div className="font-medium">Physics Study Session</div>
                    <div className="text-sm text-muted-foreground">Today at 2:00 PM</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start p-3">
                    <div className="font-medium">Great Progress!</div>
                    <div className="text-sm text-muted-foreground">You've completed 5 tests this week</div>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
