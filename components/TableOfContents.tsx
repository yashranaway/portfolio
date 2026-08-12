"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AlignLeft } from "lucide-react"

import type { TocEntry } from "@/lib/toc"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  entries: TocEntry[]
}

// Geometry follows Fumadocs' TOC (packages/base-ui/src/components/toc/default.tsx).
// Two details make it read smoothly, and both are easy to get wrong:
//
//  1. Depth changes are a cubic Bézier spanning the *gap between items*, with
//     control points nudged 4px past each end. A tight corner at the item
//     boundary looks kinked by comparison.
//  2. The active thumb is the same path clipped to the active range, not a
//     separate line — so it traces the curve exactly instead of cutting across.

const BASE = 8

/** Horizontal position of the rail for a heading depth. */
function lineOffset(depth: number): number {
  return depth <= 2 ? BASE : BASE + 8
}

/** Left padding of the link text for a heading depth. */
function itemOffset(depth: number): number {
  return depth <= 2 ? BASE + 12 : BASE + 24
}

interface Computed {
  d: string
  width: number
  height: number
  /** [top, bottom] of each item, parallel to `entries`. */
  positions: Array<[number, number]>
  /** Distance along the path at each item's [top, bottom], for the dot. */
  lengths: Array<[number, number]>
}

export default function TableOfContents({ entries }: TableOfContentsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [computed, setComputed] = useState<Computed | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container || container.clientHeight === 0 || entries.length === 0) return

    let width = 0
    let height = 0
    let d = ""
    const positions: Array<[number, number]> = []

    for (let i = 0; i < entries.length; i++) {
      const el = container.querySelector<HTMLElement>(`a[href="#${CSS.escape(entries[i].id)}"]`)
      if (!el) continue

      const styles = getComputedStyle(el)
      const x = lineOffset(entries[i].depth) + 0.5
      const top = el.offsetTop + parseFloat(styles.paddingTop)
      const bottom = el.offsetTop + el.clientHeight - parseFloat(styles.paddingBottom)

      width = Math.max(width, x + 8)
      height = Math.max(height, bottom)

      if (positions.length === 0) {
        d += ` M${x} ${top} L${x} ${bottom}`
      } else {
        const [, prevBottom] = positions[positions.length - 1]
        const prevX = lineOffset(entries[i - 1].depth) + 0.5
        d += ` C ${prevX} ${top - 4} ${x} ${prevBottom + 4} ${x} ${top} L${x} ${bottom}`
      }

      positions.push([top, bottom])
    }

    if (positions.length === 0) return

    // Walk the path to find how far along it each item sits, so the dot can
    // ride the curve via CSS offset-path.
    const probe = document.createElementNS("http://www.w3.org/2000/svg", "path")
    probe.setAttribute("d", d)
    const total = probe.getTotalLength()
    const lengths: Array<[number, number]> = []
    for (let i = 0; i < positions.length; i++) {
      const [top, bottom] = positions[i]
      let l = i > 0 ? lengths[i - 1][1] + (top - positions[i - 1][1]) : top
      while (l < total && probe.getPointAtLength(l).y < top) l++
      lengths.push([l, l + bottom - top])
    }

    setComputed({ d, width, height, positions, lengths })
  }, [entries])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    measure()
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [measure])

  // Scroll-spy: last heading whose top has passed the reading line.
  useEffect(() => {
    if (entries.length === 0) return
    const compute = () => {
      const line = window.innerHeight / 3
      let idx = 0
      for (let i = 0; i < entries.length; i++) {
        const el = document.getElementById(entries[i].id)
        if (el && el.getBoundingClientRect().top <= line) idx = i
        else break
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      setActiveIndex(atBottom ? entries.length - 1 : idx)
    }
    compute()
    window.addEventListener("scroll", compute, { passive: true })
    window.addEventListener("resize", compute)
    return () => {
      window.removeEventListener("scroll", compute)
      window.removeEventListener("resize", compute)
    }
  }, [entries])

  if (entries.length < 2) return null

  const span = computed?.positions[activeIndex]
  const dotAt = computed?.lengths[activeIndex]?.[1]

  return (
    <nav aria-label="Table of contents" className="text-sm" data-no-letter>
      <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
        <AlignLeft className="h-3.5 w-3.5" aria-hidden />
        On this page
      </p>

      <div ref={containerRef} className="relative mt-4 flex flex-col">
        {computed && (
          <div
            className="pointer-events-none absolute top-0 left-0"
            style={{ width: computed.width, height: computed.height }}
          >
            {/* Full rail, muted. */}
            <svg
              width={computed.width}
              height={computed.height}
              viewBox={`0 0 ${computed.width} ${computed.height}`}
              className="absolute inset-0"
              aria-hidden
            >
              <path
                d={computed.d}
                fill="none"
                strokeWidth="1"
                className="stroke-zinc-200 dark:stroke-zinc-700"
              />
            </svg>

            {/* Same path, clipped to the active range — so the highlight
                follows the curve rather than cutting across it. */}
            <svg
              width={computed.width}
              height={computed.height}
              viewBox={`0 0 ${computed.width} ${computed.height}`}
              className="absolute inset-0 transition-[clip-path] duration-300 ease-out"
              style={{
                clipPath: span
                  ? `polygon(0 ${span[0]}px, 100% ${span[0]}px, 100% ${span[1]}px, 0 ${span[1]}px)`
                  : "polygon(0 0, 100% 0, 100% 0, 0 0)",
              }}
              aria-hidden
            >
              <path
                d={computed.d}
                fill="none"
                strokeWidth="1.5"
                className="stroke-zinc-900 dark:stroke-white"
              />
            </svg>

            {/* Dot rides the path itself via offset-path. */}
            {dotAt !== undefined && (
              <div
                className="absolute top-0 left-0 size-1.5 rounded-full bg-zinc-900 transition-[offset-distance] duration-300 ease-out dark:bg-white"
                style={{
                  offsetPath: `path("${computed.d.trim()}")`,
                  offsetDistance: `${dotAt}px`,
                }}
              />
            )}
          </div>
        )}

        {entries.map((entry, i) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            data-active={i === activeIndex}
            aria-current={i === activeIndex ? "location" : undefined}
            style={{ paddingInlineStart: itemOffset(entry.depth) }}
            className={cn(
              "relative py-1.5 leading-snug transition-colors",
              entry.depth === 3 && "text-[13px]",
              i === activeIndex
                ? "text-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            {entry.text}
          </a>
        ))}
      </div>
    </nav>
  )
}
