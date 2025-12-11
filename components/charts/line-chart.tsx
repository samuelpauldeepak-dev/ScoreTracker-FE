"use client"
import { Line } from "react-chartjs-2"
import "chart.js/auto"

const data = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
  datasets: [
    {
      label: "Average Score",
      data: [62, 70, 68, 75, 82],
      borderColor: "hsl(var(--chart-1))",
      backgroundColor: "color-mix(in oklab, hsl(var(--chart-1)) 20%, transparent)",
      tension: 0.35,
      borderWidth: 2,
      fill: true,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, labels: { usePointStyle: true } },
    tooltip: { intersect: false, mode: "index" as const },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: "color-mix(in oklab, hsl(var(--foreground)) 20%, transparent)" } },
  },
}

export default function LineChart() {
  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  )
}
