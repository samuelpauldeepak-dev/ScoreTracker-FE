"use client"

import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function ApexAreaChart() {
  const series = [
    { name: "Score", data: [56, 62, 71, 68, 77, 83, 88] },
    { name: "Target", data: [60, 65, 70, 75, 80, 85, 90] },
  ]

  const options: any = {
    chart: {
      type: "area",
      toolbar: { show: false },
      height: 300,
      fontFamily: "var(--font-geist-sans, ui-sans-serif)",
    },
    colors: ["#2563eb", "#f59e0b"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
    grid: {
      borderColor: "rgba(127,127,127,0.2)",
      strokeDashArray: 3,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisBorder: { color: "rgba(127,127,127,0.3)" },
      axisTicks: { color: "rgba(127,127,127,0.3)" },
      labels: { style: { colors: "var(--foreground)" } },
    },
    yaxis: {
      labels: { style: { colors: "var(--foreground)" } },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: "var(--foreground)" },
    },
    tooltip: { theme: "dark" },
  }

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  )
}
