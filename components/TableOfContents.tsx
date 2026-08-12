"use client"

import { useEffect, useState } from "react"

import type { TocEntry } from "@/lib/toc"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  entries: TocEntry[]
}

export default function TableOfContents({ entries }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? "")

  useEffect(() => {
    if (entries.length === 0) return

    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    // Pick the last heading whose top has passed the reading line (~1/3 down
    // the viewport). Cheaper and less jumpy than reacting to individual
    // IntersectionObserver entries, which misbehave when several headings sit
    // on screen at once or when a section is shorter than the viewport.
    const compute = () => {
      const line = window.innerHeight / 3
      let current = headings[0]
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h
        else break
      }
      // At the very bottom, favour the last heading so the final short
      // section can still become active.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      setActiveId(atBottom ? headings[headings.length - 1].id : current.id)
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

  return (
    <nav aria-label="Table of contents" className="text-sm" data-no-letter>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        On this page
      </p>
      <ul className="mt-4 space-y-2 border-l border-zinc-200 dark:border-zinc-700">
        {entries.map((entry) => {
          const active = entry.id === activeId
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l pl-4 leading-snug transition-colors",
                  entry.depth === 3 && "pl-7 text-[13px]",
                  active
                    ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {entry.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
