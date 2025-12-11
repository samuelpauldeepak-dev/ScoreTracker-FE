"use client"
import { Bar } from "react-chartjs-2"
import "chart.js/auto"

const data = {
  labels: ["Physics", "Chemistry", "Math", "Biology"],
  datasets: [
    {
      label: "Last Test",
      data: [78, 66, 84, 72],
      backgroundColor: "hsl(var(--chart-1))",
      borderRadius: 8,
    },
    {
      label: "Avg (30 days)",
      data: [70, 61, 78, 68],
      backgroundColor: "hsl(var(--chart-4))",
      borderRadius: 8,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true, labels: { usePointStyle: true } } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: "color-mix(in oklab, hsl(var(--foreground)) 20%, transparent)" } },
  },
}

export default function BarChart() {
  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  )
}
