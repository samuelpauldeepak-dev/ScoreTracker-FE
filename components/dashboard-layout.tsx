"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { useStore } from "@/lib/store"
import { seedTests, seedSubjects, seedCalendarEvents, seedGoals } from "@/lib/seed-data"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { tests, subjects, calendarEvents, goals, isMobile } = useStore()

  const [seeded, setSeeded] = useState(false)
  useEffect(() => {
    const store = useStore.getState()
    const needsSeed = tests.length === 0 || subjects.length === 0 || calendarEvents.length === 0 || goals.length === 0
    if (!needsSeed || seeded) return
    if (tests.length === 0) seedTests.forEach((t) => store.addTest(t))
    if (subjects.length === 0) seedSubjects.forEach((s) => store.addSubject(s))
    if (calendarEvents.length === 0) seedCalendarEvents.forEach((e) => store.addCalendarEvent(e))
    if (goals.length === 0) seedGoals.forEach((g) => store.addGoal(g))
    setSeeded(true)
  }, [tests.length, subjects.length, calendarEvents.length, goals.length, seeded])

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-svh flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-h-svh">
          <AppHeader />
          <main className={cn("flex-1 overflow-y-auto", "p-4 md:p-6 lg:p-8", "space-y-6")}>
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </SidebarInset>
      </div>
      <KeyboardShortcuts />
    </SidebarProvider>
  )
}
