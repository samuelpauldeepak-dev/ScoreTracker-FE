"use client"

import { useAppStore } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function SubjectPerformance() {
  const { tests, subjects } = useAppStore()

  // Calculate subject-wise performance
  const subjectPerformance = subjects.map((subject) => {
    const subjectTests = tests.filter((test) => test.subject === subject.name)
    const averageScore =
      subjectTests.length > 0
        ? Math.round(subjectTests.reduce((sum, test) => sum + test.percentage, 0) / subjectTests.length)
        : 0

    return {
      name: subject.name,
      score: averageScore,
      tests: subjectTests.length,
      color: subject.color,
      icon: subject.icon,
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium flex items-center gap-2">
            <span>{data.icon}</span>
            {label}
          </p>
          <p className="text-chart-1">Average Score: {payload[0].value}%</p>
          <p className="text-muted-foreground text-sm">Tests: {data.tests}</p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium flex items-center gap-2">
            <span>{data.icon}</span>
            {data.name}
          </p>
          <p style={{ color: data.color }}>Score: {data.score}%</p>
          <p className="text-muted-foreground text-sm">Tests: {data.tests}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Tabs defaultValue="bar" className="space-y-4">
      <TabsList>
        <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        <TabsTrigger value="pie">Pie Chart</TabsTrigger>
      </TabsList>

      <TabsContent value="bar">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-muted-foreground" fontSize={12} />
              <YAxis className="text-muted-foreground" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="pie">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subjectPerformance}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="score"
                label={({ name, score }) => `${name}: ${score}%`}
                labelLine={false}
              >
                {subjectPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
