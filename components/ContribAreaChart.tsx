"use client"

import { AreaChart } from "@/components/dithercn/area-chart"

export interface ContribChartDatum {
  week: string
  total: number
}

interface ContribAreaChartProps {
  data: ContribChartDatum[]
  total: number
  year: number
}

// Weekly totals, one series. Intensity levels are already encoded by colour in
// the calendar on the page, so plotting the weekly total is the non-redundant
// half of the picture.
const series = [{ label: "contributions", value: "total", color: "green" }] as const

export default function ContribAreaChart({ data, total, year }: ContribAreaChartProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            contributions · {year}
          </div>
          <div className="mt-1 font-mono text-2xl text-white tabular-nums">{total}</div>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">
          per week
        </div>
      </div>

      <AreaChart
        data={data}
        x="week"
        series={series}
        bloom="low"
        height={184}
        className="-mx-2"
      />
    </div>
  )
}
