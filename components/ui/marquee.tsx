"use client"

import type { CSSProperties, HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

// Kibo UI's marquee API (Marquee / MarqueeContent / MarqueeFade / MarqueeItem),
// which is what shadcnblocks' marquee-logos-* blocks are built on.
//
// Two deliberate departures from upstream:
//
// 1. The scroll engine is CSS, not react-fast-marquee. react-fast-marquee
//    measures the track in useEffect and renders null until mounted, so all 39
//    skill chips were missing from the server HTML — bad for a page whose
//    metadata and JSON-LD lean on exactly those keywords. Duplicating the
//    track and animating it to -50% is seamless, SSRs fully, and drops a
//    dependency.
// 2. MarqueeFade uses the zinc scale rather than `from-background`. The page
//    sits on bg-zinc-50/dark:bg-zinc-900 while --background resolves to pure
//    white/black, so fading to the token would leave a seam at both edges.

export type MarqueeProps = HTMLAttributes<HTMLDivElement>

export const Marquee = ({ className, ...props }: MarqueeProps) => (
  <div className={cn("group relative w-full overflow-hidden", className)} {...props} />
)

export type MarqueeContentProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode
  /** Seconds for one full loop. Higher is slower. */
  speed?: number
  pauseOnHover?: boolean
  reverse?: boolean
}

export const MarqueeContent = ({
  className,
  children,
  speed = 40,
  pauseOnHover = true,
  reverse = false,
  style,
  ...props
}: MarqueeContentProps) => (
  <div
    className={cn(
      "flex w-max animate-marquee",
      pauseOnHover && "group-hover:[animation-play-state:paused]",
      reverse && "[animation-direction:reverse]",
      // Respect users who've asked for less motion.
      "motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:w-full motion-reduce:justify-center",
      className
    )}
    style={{ "--marquee-duration": `${speed}s`, ...style } as CSSProperties}
    {...props}
  >
    <div className="flex shrink-0 items-center">{children}</div>
    {/* Second copy makes the -50% loop seamless; hidden from AT to avoid
        reading every skill twice. */}
    <div className="flex shrink-0 items-center motion-reduce:hidden" aria-hidden>
      {children}
    </div>
  </div>
)

export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
  side: "left" | "right"
}

export const MarqueeFade = ({ className, side, ...props }: MarqueeFadeProps) => (
  <div
    className={cn(
      "pointer-events-none absolute top-0 bottom-0 z-10 h-full w-16 sm:w-24",
      "from-zinc-50 to-transparent dark:from-zinc-900",
      side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l",
      className
    )}
    {...props}
  />
)

export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>

export const MarqueeItem = ({ className, ...props }: MarqueeItemProps) => (
  <div className={cn("mx-2 flex-shrink-0 object-contain", className)} {...props} />
)
