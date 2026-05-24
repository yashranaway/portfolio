"use client"

import { useEffect, useState } from "react"

interface Place {
  city: string | null
  country: string | null
  tz: string | null
}

export default function VisitorBadge() {
  const [count, setCount] = useState<number | null>(null)
  const [place, setPlace] = useState<Place>({ city: null, country: null, tz: null })
  const [time, setTime] = useState<string>("")

  // Visit counter — increments once per browser session to avoid refresh inflation
  useEffect(() => {
    let cancelled = false
    const counted = typeof window !== "undefined" && sessionStorage.getItem("vc-counted")
    const path = counted ? "get" : "hit"
    fetch(`https://abacus.jasoncameron.dev/${path}/aditya-garud-me/visits`)
      .then((r) => r.json())
      .then((d: { value?: number }) => {
        if (cancelled) return
        if (typeof d?.value === "number") setCount(d.value)
        if (!counted && typeof window !== "undefined") sessionStorage.setItem("vc-counted", "1")
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // Visitor geolocation via IP
  useEffect(() => {
    let cancelled = false
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d: { city?: string; country_name?: string; timezone?: string }) => {
        if (cancelled) return
        setPlace({
          city: d?.city || null,
          country: d?.country_name || null,
          tz: d?.timezone || null,
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // Live clock in visitor's local timezone, ticks every minute
  useEffect(() => {
    if (!place.tz) return
    const update = () => {
      try {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: place.tz!,
          hour: "numeric",
          minute: "2-digit",
        })
        setTime(fmt.format(new Date()))
      } catch {}
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [place.tz])

  if (count == null && !place.city && !place.country) return null

  const locationLine = [
    place.city && place.country ? `${place.city}, ${place.country}` : (place.city || place.country || null),
    time || null,
  ].filter(Boolean).join(", ")

  return (
    <div
      className="font-mono text-xs text-zinc-500 dark:text-zinc-400 text-right leading-snug select-none"
      aria-label="visitor info"
    >
      {count != null && (
        <div>
          Visitors{" "}
          <span className="text-zinc-900 dark:text-white tabular-nums">
            #{count.toLocaleString()}
          </span>
        </div>
      )}
      {locationLine && <div>{locationLine}</div>}
    </div>
  )
}
