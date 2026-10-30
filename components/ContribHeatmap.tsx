"use client"

import { useEffect, useMemo, useRef } from "react"
import { EChartsHeatmapChart, type ChartConfig } from "@/components/evilcharts/charts/echarts-heatmap-chart"
import type { Contribution } from "@/lib/github"

const chartConfig = {
  contributions: {
    label: "Contributions",
    colors: {
      light: ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
      dark: ["#0e4429", "#006d32", "#26a641", "#39d353"],
    },
  },
} satisfies ChartConfig

function longestStreak(contributions: Contribution[]): number {
  let longest = 0
  let run = 0
  for (const day of contributions) {
    run = day.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  return longest
}

export default function ContribHeatmap({ contributions }: { contributions: Contribution[] }) {
  const data = useMemo(() => contributions.map((day) => ({ date: day.date, value: day.count })), [contributions])
  const total = contributions.reduce((sum, day) => sum + day.count, 0)
  const streak = longestStreak(contributions)
  // GitHub's window runs a little past 365 days, so pin it or the chart's
  // trailing-year default would drop days that the total above still counts.
  const range = useMemo<[string, string]>(
    () => [contributions[0].date, contributions[contributions.length - 1].date],
    [contributions],
  )

  // On a phone the year overflows, so start on the recent end.
  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col gap-0.5">
        <span className="text-primary text-sm font-medium">
          {total.toLocaleString("en-US")} contributions in the last year
        </span>
        <span className="text-muted-foreground text-[11px]">Longest streak {streak} days</span>
      </div>

      <div ref={scrollRef} className="mt-3 min-h-0 flex-1 overflow-x-auto">
        <EChartsHeatmapChart className="h-full min-w-[680px]" data={data} config={chartConfig} range={range}>
          <EChartsHeatmapChart.Cell dataKey="contributions" radius={2} gap={3} />
          <EChartsHeatmapChart.MonthLabel />
          <EChartsHeatmapChart.DayLabel />
          <EChartsHeatmapChart.Tooltip variant="frosted-glass" />
          <EChartsHeatmapChart.Legend />
        </EChartsHeatmapChart>
      </div>
    </div>
  )
}
