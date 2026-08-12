"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { AlignLeft } from "lucide-react"

import type { TocEntry } from "@/lib/toc"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  entries: TocEntry[]
}

/** Horizontal offset of the rail per heading depth. */
const RAIL_X: Record<2 | 3, number> = { 2: 1, 3: 13 }
/** Corner radius where the rail steps between depths. */
const CORNER = 6

interface Geometry {
  /** Full rail path, drawn muted. */
  path: string
  /** Vertical span of each item, indexed alongside `entries`. */
  spans: Array<{ top: number; bottom: number }>
  height: number
}

export default function TableOfContents({ entries }: TableOfContentsProps) {
  const listRef = useRef<HTMLUListElement | null>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [geo, setGeo] = useState<Geometry | null>(null)

  // Build the rail path from measured item positions. The rail steps sideways
  // when the heading depth changes, with a rounded corner at each step — that
  // is the whole visual trick, and it can't be done with a CSS border.
  const measure = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const items = itemRefs.current.filter((el): el is HTMLLIElement => el !== null)
    if (items.length !== entries.length || items.length === 0) return

    const listTop = list.getBoundingClientRect().top
    const spans = items.map((el) => {
      const r = el.getBoundingClientRect()
      return { top: r.top - listTop, bottom: r.bottom - listTop }
    })

    const xs = entries.map((e) => RAIL_X[e.depth])
    let d = `M ${xs[0]} ${spans[0].top}`
    for (let i = 0; i < entries.length; i++) {
      const x = xs[i]
      const nextX = i === entries.length - 1 ? x : xs[i + 1]
      const y = spans[i].bottom
      if (nextX === x) {
        d += ` L ${x} ${y}`
      } else {
        const dir = Math.sign(nextX - x)
        d += ` L ${x} ${y - CORNER}`
        d += ` Q ${x} ${y} ${x + dir * CORNER} ${y}`
        d += ` L ${nextX - dir * CORNER} ${y}`
        d += ` Q ${nextX} ${y} ${nextX} ${y + CORNER}`
      }
    }

    setGeo({ path: d, spans, height: spans[spans.length - 1].bottom })
  }, [entries])

  useLayoutEffect(() => {
    measure()
    const list = listRef.current
    if (!list || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [measure])

  // Scroll-spy: the last heading whose top has passed the reading line.
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

  const activeSpan = geo?.spans[activeIndex]
  const activeX = RAIL_X[entries[activeIndex].depth]

  return (
    <nav aria-label="Table of contents" className="text-sm" data-no-letter>
      <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
        <AlignLeft className="h-3.5 w-3.5" aria-hidden />
        On this page
      </p>

      <div className="relative mt-4">
        {/* Rail. Sits behind the links and is purely decorative. */}
        {geo && (
          <svg
            className="pointer-events-none absolute top-0 left-0 overflow-visible"
            width={RAIL_X[3] + 2}
            height={geo.height}
            aria-hidden
          >
            <path
              d={geo.path}
              fill="none"
              strokeWidth="1.5"
              className="stroke-zinc-200 dark:stroke-zinc-700"
            />
            {activeSpan && (
              <>
                <line
                  x1={activeX}
                  y1={activeSpan.top}
                  x2={activeX}
                  y2={activeSpan.bottom}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="stroke-zinc-900 transition-all duration-300 ease-out dark:stroke-white"
                />
                <circle
                  cx={activeX}
                  cy={activeSpan.bottom}
                  r="2.5"
                  className="fill-zinc-900 transition-all duration-300 ease-out dark:fill-white"
                />
              </>
            )}
          </svg>
        )}

        <ul ref={listRef} className="space-y-2">
          {entries.map((entry, i) => {
            const active = i === activeIndex
            return (
              <li
                key={entry.id}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
              >
                <a
                  href={`#${entry.id}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "block leading-snug transition-colors",
                    entry.depth === 3 ? "pl-7 text-[13px]" : "pl-4",
                    active
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {entry.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
