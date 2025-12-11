import ApexAreaChart from "@/components/charts/apex-area"
import LineChart from "@/components/charts/line-chart"
import BarChart from "@/components/charts/bar-chart"
import PieChart from "@/components/charts/pie-chart"

export default function ChartsPage() {
  return (
    <main className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-pretty">Charts (ApexCharts Demo)</h1>
          <p className="text-sm text-muted-foreground">Dummy data showing score vs target trend.</p>
        </header>
        <section className="rounded-lg border border-border dark:border-white/12 bg-card shadow-sm">
          <div className="p-4 md:p-6">
            <ApexAreaChart />
          </div>
        </section>
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card-surface">
            <div className="p-4 md:p-6">
              <h2 className="text-sm font-medium mb-2">Line Chart (Chart.js)</h2>
              <LineChart />
            </div>
          </div>
          <div className="card-surface">
            <div className="p-4 md:p-6">
              <h2 className="text-sm font-medium mb-2">Bar Chart (Chart.js)</h2>
              <BarChart />
            </div>
          </div>
          <div className="md:col-span-2 card-surface">
            <div className="p-4 md:p-6">
              <h2 className="text-sm font-medium mb-2">Pie Chart (Chart.js)</h2>
              <PieChart />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
