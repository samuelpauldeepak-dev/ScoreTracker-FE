"use client"

import { useAppStore } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, subDays, subMonths } from "date-fns"

export function PerformanceChart() {
  const { tests } = useAppStore()

  // Prepare data for different time periods
  const prepareData = (period: "week" | "month" | "year") => {
    const now = new Date()
    let startDate: Date
    let groupBy: string

    switch (period) {
      case "week":
        startDate = subDays(now, 7)
        groupBy = "day"
        break
      case "month":
        startDate = subDays(now, 30)
        groupBy = "day"
        break
      case "year":
        startDate = subMonths(now, 12)
        groupBy = "month"
        break
    }

    const filteredTests = tests
      .filter((test) => new Date(test.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Group tests by date and calculate average
    const groupedData = filteredTests.reduce(
      (acc, test) => {
        const key = groupBy === "day" ? format(new Date(test.date), "MMM dd") : format(new Date(test.date), "MMM yyyy")

        if (!acc[key]) {
          acc[key] = { date: key, scores: [], total: 0, count: 0 }
        }

        acc[key].scores.push(test.percentage)
        acc[key].total += test.percentage
        acc[key].count += 1

        return acc
      },
      {} as Record<string, { date: string; scores: number[]; total: number; count: number }>,
    )

    return Object.values(groupedData).map((group) => ({
      date: group.date,
      score: Math.round(group.total / group.count),
      tests: group.count,
    }))
  }

  const weekData = prepareData("week")
  const monthData = prepareData("month")
  const yearData = prepareData("year")

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-chart-1">Average Score: {payload[0].value}%</p>
          <p className="text-muted-foreground text-sm">Tests: {payload[0].payload.tests}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Tabs defaultValue="month" className="space-y-4">
      <TabsList>
        <TabsTrigger value="week">7 Days</TabsTrigger>
        <TabsTrigger value="month">30 Days</TabsTrigger>
        <TabsTrigger value="year">12 Months</TabsTrigger>
      </TabsList>

      <TabsContent value="week" className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
              <YAxis className="text-muted-foreground" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="month" className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
              <YAxis className="text-muted-foreground" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="year" className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
              <YAxis className="text-muted-foreground" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
