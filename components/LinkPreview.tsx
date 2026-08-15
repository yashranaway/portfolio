"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import type { StaticImageData } from "next/image"

interface LinkPreviewBadge {
  label: string
  color?: string
}

interface LinkPreviewProps {
  children: ReactNode
  title: string
  subtitle?: string
  href?: string
  avatar?: string | StaticImageData
  position?: "top" | "bottom"
  badge?: LinkPreviewBadge
}

interface PosStyle {
  top: number
  left: number
}

export default function LinkPreview({
  children,
  title,
  subtitle,
  href,
  avatar,
  position = "top",
  badge,
}: LinkPreviewProps) {
  const [triggerHover, setTriggerHover] = useState<boolean>(false)
  const [popupHover, setPopupHover] = useState<boolean>(false)
  const hovering = triggerHover || popupHover
  const triggerRef = useRef<HTMLSpanElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const triggerTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [posStyle, setPosStyle] = useState<PosStyle>({ top: 0, left: 0 })

  useEffect(() => {
    if (!hovering) return
    const compute = () => {
      const el = triggerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const popup = popupRef.current
      const gap = 12
      const vw = window.innerWidth
      const vh = window.innerHeight
      const margin = 8
      const w = Math.min(popup?.offsetWidth || 360, Math.floor(vw * 0.92))
      const h = Math.min(popup?.offsetHeight || 240, Math.floor(vh * 0.7))
      const cx = rect.left + rect.width / 2
      const left = Math.min(Math.max(cx - w / 2, margin), vw - margin - w)
      let top = rect.bottom + gap
      if (top > vh - margin - h) {
        top = rect.top - gap - h
      }
      top = Math.min(Math.max(top, margin), vh - margin - h)
      setPosStyle({ top, left })
    }
    compute()
    window.addEventListener("scroll", compute, { passive: true })
    window.addEventListener("resize", compute)
    return () => {
      window.removeEventListener("scroll", compute)
      window.removeEventListener("resize", compute)
    }
  }, [hovering, position])

  // Two independent timers so leaving the trigger doesn't get cancelled
  // by re-entering the popup (or vice versa).
  const enterTrigger = () => {
    clearTimeout(triggerTimerRef.current)
    setTriggerHover(true)
  }
  const leaveTrigger = () => {
    clearTimeout(triggerTimerRef.current)
    triggerTimerRef.current = setTimeout(() => setTriggerHover(false), 120)
  }
  const enterPopup = () => {
    clearTimeout(popupTimerRef.current)
    setPopupHover(true)
  }
  const leavePopup = () => {
    clearTimeout(popupTimerRef.current)
    popupTimerRef.current = setTimeout(() => setPopupHover(false), 120)
  }

  // Clean up timers on unmount.
  useEffect(
    () => () => {
      clearTimeout(triggerTimerRef.current)
      clearTimeout(popupTimerRef.current)
    },
    []
  )

  const avatarSrc =
    typeof avatar === "string" ? avatar : avatar?.src || undefined

  return (
    <span
      ref={triggerRef}
      // min-w-0/max-w-full let a truncating child actually shrink when this
      // sits inside a flex row; without them the trigger sizes to its content
      // and overflows the parent.
      className="inline-flex min-w-0 max-w-full"
      onMouseEnter={enterTrigger}
      onMouseLeave={leaveTrigger}
      data-no-letter
    >
      {children}
      {hovering &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-50"
            style={{ top: posStyle.top, left: posStyle.left }}
            onMouseEnter={enterPopup}
            onMouseLeave={leavePopup}
          >
            <div className="w-[360px] max-w-[92vw] rounded-lg border border-zinc-700 bg-zinc-900/95 shadow-xl backdrop-blur px-4 py-3 animate-fade-in-up text-left">
              <div className="flex items-start gap-3">
                {avatarSrc && (
                  <img
                    src={avatarSrc}
                    alt=""
                    aria-hidden
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                )}
                <div className="min-w-0 flex-1">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:underline"
                    >
                      <div className="text-sm font-medium text-white leading-snug break-words">{title}</div>
                      {subtitle && (
                        <div className="text-xs text-zinc-400 leading-snug mt-1 break-words">{subtitle}</div>
                      )}
                    </a>
                  ) : (
                    <>
                      <div className="text-sm font-medium text-white leading-snug break-words">{title}</div>
                      {subtitle && <div className="text-xs text-zinc-400 leading-snug mt-1 break-words">{subtitle}</div>}
                    </>
                  )}
                </div>
              </div>

              {badge && (
                <div className="mt-2.5">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: badge.color || "#8957e5" }}
                  >
                    {badge.label}
                  </span>
                </div>
              )}

              {href && (
                <div className="mt-2 text-[11px] font-mono text-zinc-500 truncate">
                  {href.replace(/^https?:\/\//, "")}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </span>
  )
}
