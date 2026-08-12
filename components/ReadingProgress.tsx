"use client"

import { useEffect, useState } from "react"

// Mirrors the scroll-progress bar on the homepage, but measured against the
// article element rather than the whole document, so it reaches 100% at the end
// of the post instead of the end of the page.
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const compute = () => {
      const el = document.getElementById(targetId)
      if (!el) return
      const start = el.offsetTop
      const end = start + el.offsetHeight - window.innerHeight
      const span = end - start
      if (span <= 0) {
        setProgress(window.scrollY > start ? 100 : 0)
        return
      }
      const pct = ((window.scrollY - start) / span) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    compute()
    window.addEventListener("scroll", compute, { passive: true })
    window.addEventListener("resize", compute)
    return () => {
      window.removeEventListener("scroll", compute)
      window.removeEventListener("resize", compute)
    }
  }, [targetId])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent" aria-hidden>
      <div
        className="h-full bg-zinc-900 transition-[width] duration-150 ease-linear dark:bg-white"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
