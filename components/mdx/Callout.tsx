import type { ReactNode } from "react"
import { Info, TriangleAlert, Lightbulb, CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

export type CalloutType = "note" | "tip" | "warning" | "danger"

const STYLES: Record<
  CalloutType,
  { icon: typeof Info; label: string; border: string; accent: string }
> = {
  note: {
    icon: Info,
    label: "Note",
    border: "border-sky-500/30 bg-sky-500/5",
    accent: "text-sky-600 dark:text-sky-400",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    border: "border-emerald-500/30 bg-emerald-500/5",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    icon: TriangleAlert,
    label: "Warning",
    border: "border-amber-500/30 bg-amber-500/5",
    accent: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    icon: CircleAlert,
    label: "Careful",
    border: "border-red-500/30 bg-red-500/5",
    accent: "text-red-600 dark:text-red-400",
  },
}

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

/**
 * Usage in MDX:
 *   <Callout type="warning" title="Optional heading">Body text.</Callout>
 *
 * `not-prose` is deliberate: typography's margin rules fight the padded box,
 * so spacing is set here instead.
 */
export default function Callout({ type = "note", title, children }: CalloutProps) {
  const { icon: Icon, label, border, accent } = STYLES[type]

  return (
    <div className={cn("not-prose my-6 rounded-lg border p-4", border)}>
      <div className={cn("flex items-center gap-2 font-mono text-xs font-medium", accent)}>
        <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
        <span>{title ?? label}</span>
      </div>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-mono [&_code]:text-[13px]">
        {children}
      </div>
    </div>
  )
}
