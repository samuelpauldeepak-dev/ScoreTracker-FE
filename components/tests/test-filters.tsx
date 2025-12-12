"use client"

import { useAppStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface TestFiltersProps {
  filters: {
    subject: string
    category: string
    dateRange: string
    search: string
  }
  onFiltersChange: (filters: any) => void
}

export function TestFilters({ filters, onFiltersChange }: TestFiltersProps) {
  const { subjects } = useAppStore()

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      subject: "",
      category: "",
      dateRange: "",
      search: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.subject} onValueChange={(value) => updateFilter("subject", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.name}>
                <div className="flex items-center gap-2">
                  <span>{subject.icon}</span>
                  {subject.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="mock">Mock Test</SelectItem>
            <SelectItem value="practice">Practice Test</SelectItem>
            <SelectItem value="sectional">Sectional Test</SelectItem>
            <SelectItem value="full">Full Test</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="week">Last week</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Clear filters
          </Button>
          <span className="text-sm text-muted-foreground">Active filters applied</span>
        </div>
      )}
    </div>
  )
}
