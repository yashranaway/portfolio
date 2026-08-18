"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// Ported from omacom-io/ttfx (src/effects/smoke.rs), itself a parity-exact Rust
// port of terminaltexteffects' effect_smoke.py.
//
// The look does not come from the block symbols. It comes from the traversal.
// Flooding the grid directly gives you a clean expanding disc, which reads as a
// wipe rather than smoke. ttfx builds a weighted Prim's spanning tree over the
// character grid first, then walks that tree breadth-first, so the front is
// forced through a random branching structure and arrives in tendrils.
//
// Frame counts and colors follow the Rust defaults. The RNG sequence does not:
// parity there would mean porting ttfx's seeded RNG, and nothing here depends
// on reproducing a specific run.

const SMOKE_SYMBOLS = ["░", "▒", "▓", "▒", "░"]
/** SmokeConfig::starting_color. The text sits at this gray before the smoke arrives. */
const STARTING_COLOR = "#7a7a7a"
/** SmokeConfig::final_gradient_stops, applied vertically across the block. */
const FINAL_STOPS = ["#8a008a", "#00d1ff", "#ffffff"]
/** smoke_gradient_stops chained with final_gradient_stops reversed, as in build(). */
const SMOKE_STOPS = ["#242424", "#ffffff", "#ffffff", "#00d1ff", "#8a008a"]

/** Frames each smoke symbol is held. Mirrors apply_gradient_to_symbols(symbols, 3, ..). */
const SMOKE_HOLD = 3
/** Frames spent resolving from the smoke into the settled character. */
const PAINT_FRAMES = 5
const SMOKE_FRAMES = SMOKE_SYMBOLS.length * SMOKE_HOLD

type RGB = [number, number, number]

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function css([r, g, b]: RGB): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
}

/** Position `t` (0..1) along a multi-stop ramp, interpolated in sRGB like the original. */
function ramp(stops: RGB[], t: number): RGB {
  const clamped = Math.min(1, Math.max(0, t))
  const scaled = clamped * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(scaled))
  const f = scaled - i
  const a = stops[i]
  const b = stops[i + 1]
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]
}

interface Cell {
  char: string
  row: number
  col: number
  /** Settled color, from the vertical final gradient. Deterministic, so it also renders on the server. */
  final: string
  finalRgb: RGB
}

/** Pads every line to the widest one so the effect runs over the full text box, spaces included. */
function buildGrid(text: string): { cells: Cell[]; width: number; height: number } {
  const lines = text.replace(/\t/g, "  ").replace(/^\n+|\n+$/g, "").split("\n")
  const width = Math.max(...lines.map((l) => l.length), 1)
  const height = lines.length
  const finalStops = FINAL_STOPS.map(hexToRgb)
  const cells: Cell[] = []
  for (let row = 0; row < height; row++) {
    const line = lines[row].padEnd(width, " ")
    // Vertical direction runs bottom to top in the original, so the last row
    // takes the first stop.
    const t = height === 1 ? 1 : (height - 1 - row) / (height - 1)
    const finalRgb = ramp(finalStops, t)
    const final = css(finalRgb)
    for (let col = 0; col < width; col++) {
      cells.push({ char: line[col], row, col, final, finalRgb })
    }
  }
  return { cells, width, height }
}

/**
 * PrimsWeighted from src/utils/spanning_tree.rs. Every cell gets a random
 * weight, and the tree always grows through the cheapest pending edge, so it
 * threads toward low-weight cells instead of expanding evenly.
 */
function spanningTree(width: number, height: number): number[][] {
  const n = width * height
  const weights = new Int32Array(n)
  for (let i = 0; i < n; i++) weights[i] = Math.floor(Math.random() * 100)

  const links: number[][] = Array.from({ length: n }, () => [])
  const inTree = new Uint8Array(n)
  // Buckets keyed by weight, matching the BTreeMap of pending links.
  const pending = new Map<number, Array<[number, number]>>()

  const neighbors = (i: number): number[] => {
    const row = Math.floor(i / width)
    const col = i % width
    const out: number[] = []
    if (row > 0) out.push(i - width)
    if (col < width - 1) out.push(i + 1)
    if (row < height - 1) out.push(i + width)
    if (col > 0) out.push(i - 1)
    return out
  }

  const push = (from: number) => {
    for (const to of neighbors(from)) {
      if (inTree[to]) continue
      const w = weights[to]
      const bucket = pending.get(w)
      if (bucket) bucket.push([from, to])
      else pending.set(w, [[from, to]])
    }
  }

  const start = Math.floor(Math.random() * n)
  inTree[start] = 1
  push(start)

  while (pending.size > 0) {
    const lowest = Math.min(...pending.keys())
    const bucket = pending.get(lowest)!
    const idx = Math.floor(Math.random() * bucket.length)
    const [from, to] = bucket[idx]
    bucket.splice(idx, 1)
    if (bucket.length === 0) pending.delete(lowest)
    if (inTree[to]) continue
    inTree[to] = 1
    links[from].push(to)
    links[to].push(from)
    push(to)
  }
  return links
}

/** BreadthFirst over the tree, returning one array per layer. Each layer is one frame's worth of new smoke. */
function bfsLayers(links: number[][], n: number): number[][] {
  const start = Math.floor(Math.random() * n)
  const seen = new Uint8Array(n)
  seen[start] = 1
  let frontier = [start]
  const layers: number[][] = [[start]]
  while (frontier.length > 0) {
    const next: number[] = []
    for (const cell of frontier) {
      for (const link of links[cell]) {
        if (seen[link]) continue
        seen[link] = 1
        next.push(link)
      }
    }
    if (next.length === 0) break
    layers.push(next)
    frontier = next
  }
  return layers
}

interface SmokeTextProps {
  /** Block of text to burn in. Multi-line is fine, and blank lines are kept. */
  text: string
  caption?: string
  /** Largest rendered character size in px. Scales down on narrow screens. */
  maxFontSize?: number
}

/**
 * Usage in MDX:
 *   <SmokeText text={`  ...ascii...  `} caption="ttfx smoke, ported to the web." />
 *
 * The settled state is rendered directly, so this is readable with JavaScript
 * off and there is nothing to hydrate around. The animation only starts once
 * the block scrolls into view, and is skipped outright under reduced motion.
 */
export default function SmokeText({ text, caption, maxFontSize = 14 }: SmokeTextProps) {
  // Memoized so `play` keeps a stable identity. Rebuilding the grid every
  // render would give the observer effect below a new dependency each time.
  const { cells, width } = useMemo(() => buildGrid(text), [text])
  const spansRef = useRef<Array<HTMLSpanElement | null>>([])
  const frameRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [running, setRunning] = useState(false)

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
  }, [])

  const play = useCallback(() => {
    stop()
    const n = cells.length
    const layers = bfsLayers(spanningTree(width, cells.length / width), n)
    const smokeStops = SMOKE_STOPS.map(hexToRgb)
    const startRgb = hexToRgb(STARTING_COLOR)

    const activatedAt = new Int32Array(n).fill(-1)
    const active = new Set<number>()

    // Reset to the pre-smoke state: real characters, flat gray.
    for (let i = 0; i < n; i++) {
      const span = spansRef.current[i]
      if (!span) continue
      span.textContent = cells[i].char
      span.style.color = STARTING_COLOR
    }

    setRunning(true)
    let frame = 0
    let layer = 0

    const tick = () => {
      if (layer < layers.length) {
        for (const cell of layers[layer]) {
          activatedAt[cell] = frame
          active.add(cell)
        }
        layer++
      }

      for (const i of active) {
        const span = spansRef.current[i]
        if (!span) continue
        const age = frame - activatedAt[i]
        if (age < SMOKE_FRAMES) {
          span.textContent = SMOKE_SYMBOLS[Math.floor(age / SMOKE_HOLD)]
          span.style.color = css(ramp(smokeStops, age / SMOKE_FRAMES))
        } else if (age < SMOKE_FRAMES + PAINT_FRAMES) {
          // SceneComplete on "smoke" activates "paint": the character comes
          // back and runs a short gradient into its settled color.
          const t = (age - SMOKE_FRAMES) / PAINT_FRAMES
          span.textContent = cells[i].char
          span.style.color = css(ramp([startRgb, cells[i].finalRgb], t))
        } else {
          span.textContent = cells[i].char
          span.style.color = cells[i].final
          active.delete(i)
        }
      }

      frame++
      if (layer < layers.length || active.size > 0) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        frameRef.current = null
        setRunning(false)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [cells, width, stop])

  // Read through a ref so the observer effect can hold empty deps. Depending on
  // `play` directly would tear down and rebuild the observer mid-animation.
  const playRef = useRef(play)
  useEffect(() => {
    playRef.current = play
  })

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          // Fire once. Re-entering the viewport is what the replay button is for.
          observer.disconnect()
          playRef.current()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => stop, [stop])

  return (
    <figure className="not-prose my-10">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-6 sm:px-6"
      >
        <div
          aria-hidden
          className="select-none font-mono leading-[1.15] tracking-[0.02em]"
          style={{ fontSize: `clamp(3px, ${Math.round((150 / width) * 100) / 100}vw, ${maxFontSize}px)` }}
        >
          {Array.from({ length: cells.length / width }, (_, row) => (
            <div key={row} className="whitespace-pre">
              {Array.from({ length: width }, (_, col) => {
                const i = row * width + col
                return (
                  <span
                    key={col}
                    ref={(el) => {
                      spansRef.current[i] = el
                    }}
                    style={{ color: cells[i].final }}
                  >
                    {cells[i].char}
                  </span>
                )
              })}
            </div>
          ))}
        </div>

        {/* The grid is decorative once it is animating, so expose the text once, plainly. */}
        <span className="sr-only">{text.trim()}</span>

        <button
          type="button"
          onClick={play}
          disabled={running}
          className="absolute right-2 top-2 rounded border border-zinc-700 bg-zinc-900/80 px-2 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-40"
        >
          {running ? "burning" : "replay"}
        </button>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-mono text-xs leading-relaxed text-zinc-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
