"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function RecentTests() {
  const { tests } = useAppStore()

  // Get the 5 most recent tests
  const recentTests = tests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mock":
        return "bg-chart-1 text-white"
      case "practice":
        return "bg-chart-2 text-white"
      case "sectional":
        return "bg-chart-3 text-white"
      case "full":
        return "bg-chart-4 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTests.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No tests recorded yet. Add your first test result!
          </p>
        ) : (
          recentTests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{test.name}</p>
                  <Badge className={getCategoryColor(test.category)} variant="secondary">
                    {test.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{test.subject}</span>
                  <span>{format(new Date(test.date), "MMM dd")}</span>
                  <span className={`font-medium ${getScoreColor(test.percentage)}`}>
                    {test.score}/{test.totalMarks} ({test.percentage}%)
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
