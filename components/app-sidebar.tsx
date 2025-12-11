"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  BarChartBig as ChartBar,
  FileText,
  Home,
  MessageSquare,
  Settings,
  TestTube,
  User,
  Trophy,
  HelpCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const data = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
          badge: null,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: ChartBar,
          badge: null,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Tests",
          url: "/tests",
          icon: TestTube,
          badge: "tests",
        },
        {
          title: "Subjects",
          url: "/subjects",
          icon: BookOpen,
          badge: "subjects",
        },
        {
          title: "Calendar",
          url: "/calendar",
          icon: Calendar,
          badge: "events",
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          title: "Messages",
          url: "/messages",
          icon: MessageSquare,
          badge: "3",
        },
        {
          title: "Reports",
          url: "/reports",
          icon: FileText,
          badge: null,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          url: "/profile",
          icon: User,
          badge: null,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          badge: null,
        },
        {
          title: "Help",
          url: "/help",
          icon: HelpCircle,
          badge: null,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { tests, subjects, calendarEvents, user } = useStore()

  const getBadgeCount = (badgeType: string | null) => {
    switch (badgeType) {
      case "tests":
        return tests.length > 0 ? tests.length.toString() : null
      case "subjects":
        return subjects.length > 0 ? subjects.length.toString() : null
      case "events":
        const upcomingEvents = calendarEvents.filter((event) => new Date(event.date) > new Date()).length
        return upcomingEvents > 0 ? upcomingEvents.toString() : null
      default:
        return badgeType
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
            <ChartBar className="h-5 w-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-sidebar-foreground">ScoreTracker</span>
            <span className="truncate text-xs text-sidebar-foreground/70">{user?.examType || "Exam Analytics"}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  const badgeCount = getBadgeCount(item.badge)

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "group relative",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "transition-all duration-200",
                          isActive && "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm",
                        )}
                      >
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon
                            className={cn("h-4 w-4 transition-colors", isActive && "text-sidebar-primary-foreground")}
                          />
                          <span className="flex-1">{item.title}</span>
                          {badgeCount && (
                            <Badge variant={isActive ? "secondary" : "outline"} className="h-5 px-1.5 text-xs">
                              {badgeCount}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
            <Trophy className="h-3 w-3" />
            <span>Level {Math.floor((tests.length || 0) / 5) + 1}</span>
          </div>
          <div className="text-xs text-sidebar-foreground/40">© 2024 ScoreTracker</div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
