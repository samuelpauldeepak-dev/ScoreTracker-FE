"use client"

import { Bell, Search, User, Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { useStore } from "@/lib/store"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function AppHeader() {
  const { user, logout, isMobile } = useStore()
  const { toggleSidebar } = useSidebar()

  // controlled open state for menus
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0" aria-label="Toggle sidebar">
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests, subjects, or topics..."
            className={cn(
              "pl-10 pr-4",
              "bg-muted/50 border-border/50",
              "focus:bg-background focus:border-primary/50",
              "transition-all duration-200",
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button size="sm" className="hidden md:flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Test
        </Button>

        {/* Notifications menu is controlled and rendered with a strong surface */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover-lift"
              aria-label="Open notifications"
              aria-expanded={notifOpen}
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground animate-pulse">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-2 bg-card border border-border dark:border-white/15 shadow-xl shadow-black/10 dark:shadow-black/40"
          >
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 hover:bg-muted/50">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">New test reminder</p>
                <p className="text-xs text-muted-foreground">NEET Mock Test 2 is scheduled for tomorrow</p>
                <p className="text-xs text-primary">2 hours ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-muted/50">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">🎉 Achievement unlocked!</p>
                <p className="text-xs text-muted-foreground">You've completed 5 tests this week</p>
                <p className="text-xs text-success">1 day ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-muted/50">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Study reminder</p>
                <p className="text-xs text-muted-foreground">Time to review Physics - Electromagnetism</p>
                <p className="text-xs text-warning">3 days ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary">View all notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />

        <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full hover-lift"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <Avatar className="h-9 w-9 border-2 border-border">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 p-2 bg-card border border-border dark:border-white/15 shadow-xl shadow-black/10 dark:shadow-black/40"
            align="end"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                <p className="text-xs leading-none text-primary font-medium">{user?.examType}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onSelect={() => setProfileOpen(false)}>
              <a href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onSelect={() => setProfileOpen(false)}>
              <a href="/settings" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setProfileOpen(false)
                logout()
              }}
              className="text-destructive focus:text-destructive"
            >
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
