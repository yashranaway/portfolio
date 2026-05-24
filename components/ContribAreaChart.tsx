"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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

type LevelKey = "l1" | "l2" | "l3" | "l4"

// GitHub-style contribution-level palette (dark theme)
const LEVEL_COLORS: Record<LevelKey, string> = {
  l1: "#0e4429",
  l2: "#006d32",
  l3: "#26a641",
  l4: "#39d353",
}
const LEVEL_LABELS: Record<LevelKey, string> = {
  l1: "low",
  l2: "med",
  l3: "high",
  l4: "peak",
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload?: ContribChartDatum }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  const row = payload[0]?.payload || ({} as Partial<ContribChartDatum>)
  const total = row.total ?? 0
  const order: LevelKey[] = ["l4", "l3", "l2", "l1"]
  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900/95 backdrop-blur px-3 py-2 shadow-xl min-w-[160px]">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">week of</div>
      <div className="font-mono text-xs text-zinc-300 mt-0.5">{label}</div>
      <div className="mt-2 space-y-1">
        {order.map((k) => (
          <div key={k} className="flex items-center gap-2 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: LEVEL_COLORS[k] }} />
            <span className="text-zinc-400 w-9">{LEVEL_LABELS[k]}</span>
            <span className="text-zinc-300 tabular-nums ml-auto">{row[k] ?? 0}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-500">total</span>
        <span className="text-white tabular-nums">{total}</span>
      </div>
    </div>
  )
}

export default function ContribAreaChart({ data, total, year }: ContribAreaChartProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">contributions · {year}</div>
          <div className="mt-1 font-mono text-2xl text-white tabular-nums">{total}</div>
        </div>
        <div className="flex items-center gap-2.5">
          {(Object.entries(LEVEL_LABELS) as Array<[LevelKey, string]>).map(([k, lbl]) => (
            <div key={k} className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">
              <span className="w-2 h-2 rounded-sm" style={{ background: LEVEL_COLORS[k] }} />
              {lbl}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {(Object.entries(LEVEL_COLORS) as Array<[LevelKey, string]>).map(([k, c]) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.85} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.35} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,244,245,0.06)" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={Math.max(1, Math.floor(data.length / 6))}
              tick={{ fill: "#a1a1aa", fontFamily: "ui-monospace, monospace" }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={26}
              allowDecimals={false}
              tick={{ fill: "#71717a", fontFamily: "ui-monospace, monospace" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(57,211,83,0.35)", strokeWidth: 1, strokeDasharray: "3 3" }}
            />
            <Area type="monotone" dataKey="l1" stackId="1" stroke={LEVEL_COLORS.l1} fill="url(#grad-l1)" strokeWidth={1} />
            <Area type="monotone" dataKey="l2" stackId="1" stroke={LEVEL_COLORS.l2} fill="url(#grad-l2)" strokeWidth={1} />
            <Area type="monotone" dataKey="l3" stackId="1" stroke={LEVEL_COLORS.l3} fill="url(#grad-l3)" strokeWidth={1} />
            <Area type="monotone" dataKey="l4" stackId="1" stroke={LEVEL_COLORS.l4} fill="url(#grad-l4)" strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
