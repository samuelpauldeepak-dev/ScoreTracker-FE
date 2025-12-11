"use client"
import { Pie } from "react-chartjs-2"
import "chart.js/auto"

const data = {
  labels: ["Correct", "Incorrect", "Unattempted"],
  datasets: [
    {
      label: "Distribution",
      data: [68, 22, 10],
      backgroundColor: ["hsl(var(--chart-1))", "hsl(var(--chart-5))", "hsl(var(--chart-4))"],
      borderColor: "oklch(0.98 0 0 / 0.9)",
      borderWidth: 2,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" as const, labels: { usePointStyle: true } } },
}

export default function PieChart() {
  return (
    <div className="h-64">
      <Pie data={data} options={options} />
    </div>
  )
}
