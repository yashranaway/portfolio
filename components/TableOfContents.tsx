"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AlignLeft } from "lucide-react"

import type { TocEntry } from "@/lib/toc"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  entries: TocEntry[]
}

// Geometry and active-tracking follow Fumadocs
// (packages/base-ui/src/components/toc/default.tsx + packages/core/src/toc.tsx).
//
// Three details make it behave like the original:
//
//  1. Depth changes are a cubic Bézier spanning the gap between items, not a
//     tight corner at the item boundary.
//  2. The thumb is the same path clipped to the active range, so it traces the
//     curve instead of cutting across it.
//  3. *Multiple* headings are active at once — every one currently on screen —
//     and the thumb spans first-active to last-active. Tracking a single index
//     gives a one-item thumb that slides, which is not the same effect.

const BASE = 8

function lineOffset(depth: number): number {
  return depth <= 2 ? BASE : BASE + 8
}

function itemOffset(depth: number): number {
  return depth <= 2 ? BASE + 12 : BASE + 24
}

interface Computed {
  d: string
  width: number
  height: number
  positions: Array<[number, number]>
  lengths: Array<[number, number]>
}

export default function TableOfContents({ entries }: TableOfContentsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [computed, setComputed] = useState<Computed | null>(null)
  const [range, setRange] = useState<[number, number]>([0, 0])
  // Fumadocs sends the dot to the top of the range when scrolling up and the
  // bottom when scrolling down, so it always leads the direction of travel.
  const [isUp, setIsUp] = useState(false)
  const prevRange = useRef<[number, number]>([0, 0])

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

  // Active tracking. Every heading intersecting the viewport counts, so the
  // thumb covers a range rather than a single item.
  useEffect(() => {
    if (entries.length === 0) return

    const elements = entries.map((e) => document.getElementById(e.id))
    const visible = new Set<string>()

    const apply = () => {
      let start = -1
      let end = -1
      for (let i = 0; i < entries.length; i++) {
        if (!visible.has(entries[i].id)) continue
        if (start === -1) start = i
        end = i
      }

      // Nothing on screen (mid-section, long prose): fall back to the heading
      // nearest the top of the viewport, matching Fumadocs.
      if (start === -1) {
        let best = -1
        let min = Number.MAX_VALUE
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i]
          if (!el) continue
          const d = Math.abs(el.getBoundingClientRect().top)
          if (d < min) {
            min = d
            best = i
          }
        }
        if (best === -1) return
        start = best
        end = best
      }

      const prev = prevRange.current
      if (start !== prev[0] || end !== prev[1]) {
        setIsUp(start < prev[0] || end < prev[1])
        prevRange.current = [start, end]
        setRange([start, end])
      }
    }

    const observer = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          if (r.isIntersecting) visible.add(r.target.id)
          else visible.delete(r.target.id)
        }
        apply()
      },
      { threshold: 0.9 }
    )

    for (const el of elements) if (el) observer.observe(el)
    apply()
    window.addEventListener("scroll", apply, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", apply)
    }
  }, [entries])

  if (entries.length < 2) return null

  const [startIdx, endIdx] = range
  const top = computed?.positions[startIdx]?.[0]
  const bottom = computed?.positions[endIdx]?.[1]
  const dotAt = isUp ? computed?.lengths[startIdx]?.[0] : computed?.lengths[endIdx]?.[1]

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

            <svg
              width={computed.width}
              height={computed.height}
              viewBox={`0 0 ${computed.width} ${computed.height}`}
              className="absolute inset-0 transition-[clip-path] duration-300 ease-out"
              style={{
                clipPath:
                  top !== undefined && bottom !== undefined
                    ? `polygon(0 ${top}px, 100% ${top}px, 100% ${bottom}px, 0 ${bottom}px)`
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

        {entries.map((entry, i) => {
          const active = i >= startIdx && i <= endIdx
          return (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              data-active={active}
              aria-current={active ? "location" : undefined}
              style={{ paddingInlineStart: itemOffset(entry.depth) }}
              className={cn(
                "relative py-1.5 leading-snug transition-colors",
                entry.depth === 3 && "text-[13px]",
                active
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              {entry.text}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
