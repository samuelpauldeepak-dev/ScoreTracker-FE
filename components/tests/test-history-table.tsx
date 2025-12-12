"use client"

import { useState, useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown } from "lucide-react"
import { TestDetailDialog } from "./test-detail-dialog"

interface TestHistoryTableProps {
  filters: {
    subject: string
    category: string
    dateRange: string
    search: string
  }
}

export function TestHistoryTable({ filters }: TestHistoryTableProps) {
  const { tests, deleteTest } = useAppStore()
  const { toast } = useToast()
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)
  const [deleteTestId, setDeleteTestId] = useState<string | null>(null)
  const [viewTestId, setViewTestId] = useState<string | null>(null)
  const [editTestId, setEditTestId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter tests based on filters
  const filteredTests = useMemo(() => {
    let filtered = [...tests]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (test) => test.name.toLowerCase().includes(searchLower) || test.subject.toLowerCase().includes(searchLower),
      )
    }

    // Subject filter
    if (filters.subject) {
      filtered = filtered.filter((test) => test.subject === filters.subject)
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((test) => test.category === filters.category)
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date()
      const filterDate = new Date()

      switch (filters.dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          filterDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((test) => new Date(test.date) >= filterDate)
    }

    return filtered
  }, [tests, filters])

  // Sort tests
  const sortedTests = useMemo(() => {
    if (!sortConfig) {
      return filteredTests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    return [...filteredTests].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a]
      const bValue = b[sortConfig.key as keyof typeof b]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredTests, sortConfig])

  // Paginate tests
  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedTests.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedTests, currentPage])

  const totalPages = Math.ceil(sortedTests.length / itemsPerPage)

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleDelete = async (testId: string) => {
    deleteTest(testId)
    setDeleteTestId(null)
    toast({
      title: "Test Deleted",
      description: "The test has been removed from your history.",
    })
  }

  const handleView = (testId: string) => {
    setViewTestId(testId)
  }

  const handleEdit = (testId: string) => {
    setViewTestId(null)
    setEditTestId(testId)
    toast({
      title: "Edit Mode",
      description: "Test editing coming soon!",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mock":
        return "bg-chart-1 text-white hover:bg-chart-1/80"
      case "practice":
        return "bg-chart-2 text-white hover:bg-chart-2/80"
      case "sectional":
        return "bg-chart-3 text-white hover:bg-chart-3/80"
      case "full":
        return "bg-chart-4 text-white hover:bg-chart-4/80"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 font-medium"
    if (percentage >= 60) return "text-yellow-600 font-medium"
    return "text-red-600 font-medium"
  }

  if (sortedTests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {filteredTests.length === 0 && tests.length > 0
            ? "No tests match your current filters."
            : "No tests found. Add your first test result to get started!"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-medium">
                  Test Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("subject")} className="h-auto p-0 font-medium">
                  Subject
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("date")} className="h-auto p-0 font-medium">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("percentage")} className="h-auto p-0 font-medium">
                  Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.name}</TableCell>
                <TableCell>{test.subject}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(test.category)} variant="secondary">
                    {test.category}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(test.date), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div>
                    <span className={getScoreColor(test.percentage)}>
                      {test.score}/{test.totalMarks}
                    </span>
                    <div className="text-xs text-muted-foreground">{test.percentage}%</div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => handleView(test.id)}>
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => handleEdit(test.id)}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive" onClick={() => setDeleteTestId(test.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedTests.length)}{" "}
            of {sortedTests.length} tests
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Test Detail Dialog */}
      <TestDetailDialog
        testId={viewTestId}
        open={!!viewTestId}
        onClose={() => setViewTestId(null)}
        onEdit={() => handleEdit(viewTestId!)}
        onDelete={() => {
          setViewTestId(null)
          setDeleteTestId(viewTestId)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTestId} onOpenChange={() => setDeleteTestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTestId && handleDelete(deleteTestId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
