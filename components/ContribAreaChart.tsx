"use client"

import { AreaChart } from "@/components/dither-kit/area-chart"
import { Area } from "@/components/dither-kit/area"
import { XAxis } from "@/components/dither-kit/x-axis"
import { YAxis } from "@/components/dither-kit/y-axis"
import { Tooltip } from "@/components/dither-kit/tooltip"

export interface ContribChartDatum {
  week: string
  l1: number
  l2: number
  l3: number
  l4: number
  total: number
}

interface ContribAreaChartProps {
  data: ContribChartDatum[]
  total: number
  year: number
}

// Weekly totals, one series. This used to stack l1..l4 in GitHub's four-green
// ramp, which Dither Kit can't express: `DitherColor` is a closed union of
// seven names, so all four levels would paint the same green. The levels are
// already encoded by colour in the ActivityCalendar directly above this, so
// plotting the weekly total is the non-redundant half of the picture.
const config = {
  total: { label: "contributions", color: "green" },
} as const

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

      <div className="flex-1 min-h-0 -mx-2">
        <AreaChart
          data={data}
          config={config}
          bloom="aura"
          margins={{ top: 8, right: 10, left: 0, bottom: 0 }}
          className="h-full w-full"
        >
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip labelKey="week" />
          <Area dataKey="total" variant="gradient" />
        </AreaChart>
      </div>
    </div>
  )
}
