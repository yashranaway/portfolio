"use client"

import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// Adapted from Aceternity UI's "Card Hover Effect" (@aceternity/card-hover-effect).
// Two changes from the original: the card body is a slot rather than a fixed
// {title, description, link} shape, so callers keep their own markup and grid
// spans; and the palette follows the site's zinc scale in both themes instead
// of the stock dark-only bg-black.
//
// The highlight slides between cards because every instance shares one
// layoutId — motion reparents the same element rather than cross-fading two.

interface HoverHighlightCardProps {
  hovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  /** Shared across every card in a group; distinct groups need distinct ids. */
  layoutId?: string
  className?: string
  children: ReactNode
}

export function HoverHighlightCard({
  hovered,
  onMouseEnter,
  onMouseLeave,
  layoutId = "hoverBackground",
  className,
  children,
}: HoverHighlightCardProps) {
  return (
    <div
      className={cn("group relative block h-full w-full p-2", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 block h-full w-full rounded-2xl bg-zinc-200/80 dark:bg-zinc-800"
            layoutId={layoutId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "relative z-20 h-full w-full overflow-hidden rounded-xl p-4 sm:p-6",
          "border border-zinc-200 bg-white/80 backdrop-blur-sm transition-colors duration-300",
          "group-hover:border-zinc-300",
          "dark:border-zinc-700 dark:bg-zinc-800/80 dark:group-hover:border-zinc-600"
        )}
      >
        {children}
      </div>
    </div>
  )
}
