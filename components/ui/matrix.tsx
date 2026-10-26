"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type Frame = number[][] // [row][col] brightness 0..1

export type MatrixPalette = {
  on: string
  off: string
}

export type MatrixProps = {
  rows: number
  cols: number
  pattern?: Frame
  frames?: Frame[]
  fps?: number
  autoplay?: boolean
  loop?: boolean
  size?: number
  gap?: number
  palette?: MatrixPalette
  brightness?: number
  ariaLabel?: string
  onFrame?: (index: number) => void
  mode?: "default" | "vu"
  levels?: number[]
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

// Helper function to create VU meter frames
export function vu(cols: number, levels: number[]): Frame {
  const frame: Frame = Array(7).fill(null).map(() => Array(cols).fill(0))
  for (let col = 0; col < cols && col < levels.length; col++) {
    const level = Math.max(0, Math.min(1, levels[col]))
    const activeRows = Math.floor(level * 7)
    for (let row = 0; row < activeRows; row++) {
      frame[6 - row][col] = 1
    }
    // Partial brightness for the last row if needed
    if (activeRows < 7) {
      const partial = (level * 7) % 1
      if (partial > 0) {
        frame[6 - activeRows][col] = partial
      }
    }
  }
  return frame
}

// Built-in animation presets
export const wave: Frame[] = Array.from({ length: 24 }, (_, i) => {
  const frame: Frame = Array(7).fill(null).map(() => Array(7).fill(0))
  for (let row = 0; row < 7; row++) {
    const phase = ((i / 24) * Math.PI * 2) + (row / 7) * Math.PI * 2
    const intensity = (Math.sin(phase) + 1) / 2
    for (let col = 0; col < 7; col++) {
      frame[row][col] = intensity
    }
  }
  return frame
})

export const pulse: Frame[] = Array.from({ length: 16 }, (_, i) => {
  const frame: Frame = Array(7).fill(null).map(() => Array(7).fill(0))
  const intensity = (Math.sin((i / 16) * Math.PI * 2) + 1) / 2
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const dist = Math.sqrt(Math.pow(row - 3, 2) + Math.pow(col - 3, 2))
      const maxDist = Math.sqrt(18)
      const normalizedDist = dist / maxDist
      const pulseValue = intensity * (1 - normalizedDist)
      frame[row][col] = Math.max(0, pulseValue)
    }
  }
  return frame
})

export const loader: Frame[] = Array.from({ length: 12 }, (_, i) => {
  const frame: Frame = Array(7).fill(null).map(() => Array(7).fill(0))
  const positions = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
    [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
    [5, 0], [4, 0], [3, 0], [2, 0], [1, 0]
  ]
  const totalPositions = positions.length
  const activeCount = Math.floor((i / 12) * totalPositions)
  for (let j = 0; j < activeCount; j++) {
    const [row, col] = positions[j]
    frame[row][col] = 1
  }
  // Fade out for smooth transition
  if (activeCount < totalPositions) {
    const [row, col] = positions[activeCount]
    frame[row][col] = ((i / 12) * totalPositions) % 1
  }
  return frame
})

export const snake: Frame[] = Array.from({ length: 40 }, (_, i) => {
  const frame: Frame = Array(7).fill(null).map(() => Array(7).fill(0))
  const snakeLength = 5
  for (let j = 0; j < snakeLength; j++) {
    const pos = (i - j + 40) % 40
    const row = Math.floor(pos / 7)
    const col = pos % 7
    if (row < 7 && col < 7) {
      const brightness = 1 - (j / snakeLength) * 0.5
      frame[row][col] = brightness
    }
  }
  return frame
})

// 7-segment style digits (0-9) on a 7×5 grid
export const digits: Frame[] = [
  // 0
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // 1
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  // 2
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  // 3
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // 4
  [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
  ],
  // 5
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // 6
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // 7
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
  ],
  // 8
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // 9
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
]

export const chevronLeft: Frame = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0],
  [1, 1, 1, 0, 0],
  [1, 1, 1, 1, 0],
  [1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0],
]

export const chevronRight: Frame = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1],
  [0, 1, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 0],
  [0, 0, 1, 0, 0],
]

// Helper function to create patterns with consistent size
function createPattern(size: number, generator: (row: number, col: number, i: number, frameCount: number) => number, frameCount: number = 30): Frame[] {
  return Array.from({ length: frameCount }, (_, i) => {
    const frame: Frame = Array(size).fill(null).map(() => Array(size).fill(0))
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        frame[row][col] = Math.max(0, Math.min(1, generator(row, col, i, frameCount)))
      }
    }
    return frame
  })
}

// Pattern 1: Concentric square wave
export const concentricSquare: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const phase = (i / frameCount) * Math.PI * 2
  const dx = Math.abs(col - center)
  const dy = Math.abs(row - center)
  const dist = Math.max(dx, dy)
  const waveValue = Math.sin((dist * 0.6) - phase)
  let brightness = (waveValue + 1) / 2
  if (dist < 2) brightness *= 0.3
  const normalizedDist = dist / 10
  if (normalizedDist > 0.7) {
    brightness *= Math.max(0, (1 - normalizedDist) / 0.3)
  }
  return brightness
})

// Pattern 2: Radial pulse
export const radialPulse: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const dist = Math.sqrt(Math.pow(col - center, 2) + Math.pow(row - center, 2))
  const phase = (i / frameCount) * Math.PI * 2
  const waveValue = Math.sin((dist * 0.4) - phase)
  return (waveValue + 1) / 2
})

// Pattern 3: Diagonal waves
export const diagonalWaves: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const diag = row + col
  const waveValue = Math.sin((diag * 0.3) - phase)
  return (waveValue + 1) / 2
})

// Pattern 4: Horizontal waves
export const horizontalWaves: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const waveValue = Math.sin((row * 0.4) - phase)
  return (waveValue + 1) / 2
})

// Pattern 5: Vertical waves
export const verticalWaves: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const waveValue = Math.sin((col * 0.4) - phase)
  return (waveValue + 1) / 2
})

// Pattern 6: Spiral
export const spiral: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const dx = col - center
  const dy = row - center
  const angle = Math.atan2(dy, dx)
  const dist = Math.sqrt(dx * dx + dy * dy)
  const phase = (i / frameCount) * Math.PI * 4
  const spiralValue = Math.sin((angle * 3 + dist * 0.5) - phase)
  return (spiralValue + 1) / 2
})

// Pattern 7: Checkerboard pulse
export const checkerboardPulse: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const check = (row + col) % 2
  const pulse = (Math.sin(phase) + 1) / 2
  return check ? pulse : 1 - pulse
})

// Pattern 8: Corner to corner
export const cornerToCorner: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * 2
  const dist1 = Math.abs(row - col)
  const dist2 = Math.abs(row - (19 - col))
  const minDist = Math.min(dist1, dist2)
  const brightness = Math.max(0, 1 - (minDist / 20) - phase)
  return brightness
})

// Pattern 9: Expanding circles
export const expandingCircles: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const dist = Math.sqrt(Math.pow(col - center, 2) + Math.pow(row - center, 2))
  const phase = (i / frameCount) * 20
  const ring = Math.abs(dist - phase) % 4
  return ring < 1 ? 1 : Math.max(0, 1 - ring / 2)
})

// Pattern 10: Random dots
export const randomDots: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const seed = (row * 20 + col + i * 100) % 1000
  const random = (Math.sin(seed) * 10000) % 1
  return random > 0.7 ? 1 : random * 0.3
})

// Pattern 11: Grid fade
export const gridFade: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const center = 10
  const dist = Math.max(Math.abs(row - center), Math.abs(col - center))
  const fade = Math.sin(phase) * 0.5 + 0.5
  return Math.max(0, fade * (1 - dist / 10))
})

// Pattern 12: X pattern
export const xPattern: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const diag1 = Math.abs(row - col)
  const diag2 = Math.abs(row - (19 - col))
  const minDiag = Math.min(diag1, diag2)
  const wave = Math.sin(phase + minDiag * 0.5)
  return (wave + 1) / 2
})

// Pattern 13: Concentric rings
export const concentricRings: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const dist = Math.sqrt(Math.pow(col - center, 2) + Math.pow(row - center, 2))
  const phase = (i / frameCount) * Math.PI * 2
  const ring = Math.floor(dist / 2)
  const ringPhase = (ring * 0.5) - phase
  return (Math.sin(ringPhase) + 1) / 2
})

// Pattern 14: Perlin-like noise
export const noisePattern: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = i / frameCount
  const x = col * 0.2 + phase
  const y = row * 0.2 + phase
  const noise = Math.sin(x * 3.14) * Math.cos(y * 3.14) * Math.sin((x + y) * 2.71)
  return (noise + 1) / 2
})

// Pattern 15: Star burst
export const starBurst: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const dx = col - center
  const dy = row - center
  const angle = Math.atan2(dy, dx)
  const dist = Math.sqrt(dx * dx + dy * dy)
  const phase = (i / frameCount) * Math.PI * 2
  const rays = 8
  const rayValue = Math.sin(angle * rays - phase)
  const distFactor = Math.max(0, 1 - dist / 10)
  return (rayValue + 1) / 2 * distFactor
})

// Pattern 16: Wave interference
export const waveInterference: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const wave1 = Math.sin((row * 0.3) - phase)
  const wave2 = Math.sin((col * 0.3) - phase)
  return ((wave1 + wave2) / 2 + 1) / 2
})

// Pattern 17: Rotating squares
export const rotatingSquares: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const phase = (i / frameCount) * Math.PI * 2
  const dx = col - center
  const dy = row - center
  const rotatedX = dx * Math.cos(phase) - dy * Math.sin(phase)
  const rotatedY = dx * Math.sin(phase) + dy * Math.cos(phase)
  const squareDist = Math.max(Math.abs(rotatedX), Math.abs(rotatedY))
  const wave = Math.sin(squareDist * 0.5 - phase * 2)
  return (wave + 1) / 2
})

// Pattern 18: Matrix rain effect
export const matrixRain: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * 20
  const drop = (col * 3 + phase) % 25
  const dist = Math.abs(row - drop)
  return dist < 3 ? Math.max(0, 1 - dist / 3) : 0
})

// Pattern 19: Breathing effect
export const breathing: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const center = 10
  const phase = (i / frameCount) * Math.PI * 2
  const dx = Math.abs(col - center)
  const dy = Math.abs(row - center)
  const dist = Math.max(dx, dy)
  const breath = Math.sin(phase) * 0.5 + 0.5
  const maxDist = 10 * breath
  return dist < maxDist ? Math.max(0, 1 - dist / maxDist) : 0
})

// Pattern 20: Zigzag
export const zigzag: Frame[] = createPattern(20, (row, col, i, frameCount) => {
  const phase = (i / frameCount) * Math.PI * 2
  const zig = Math.abs((row + col) % 4 - 2)
  const wave = Math.sin(phase + zig)
  return (wave + 1) / 2
})

// Array of all patterns for random selection
export const allPatterns: Frame[][] = [
  concentricSquare,
  radialPulse,
  diagonalWaves,
  horizontalWaves,
  verticalWaves,
  spiral,
  checkerboardPulse,
  cornerToCorner,
  expandingCircles,
  randomDots,
  gridFade,
  xPattern,
  concentricRings,
  noisePattern,
  starBurst,
  waveInterference,
  rotatingSquares,
  matrixRain,
  breathing,
  zigzag,
]

// Component that randomly cycles through patterns
export function RandomMatrix({
  patternChangeInterval = 5000, // Change pattern every 5 seconds
  ...matrixProps
}: {
  patternChangeInterval?: number
} & Omit<MatrixProps, "frames">) {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [currentFrames, setCurrentFrames] = useState<Frame[]>(allPatterns[0])

  useEffect(() => {
    // Set initial pattern
    setCurrentFrames(allPatterns[0])

    // Change pattern at intervals
    const interval = setInterval(() => {
      setCurrentPatternIndex((prev) => {
        // Pick a random different pattern
        let nextIndex
        do {
          nextIndex = Math.floor(Math.random() * allPatterns.length)
        } while (nextIndex === prev && allPatterns.length > 1)
        
        setCurrentFrames(allPatterns[nextIndex])
        return nextIndex
      })
    }, patternChangeInterval)

    return () => clearInterval(interval)
  }, [patternChangeInterval])

  // Use key to force reset when pattern changes
  return <Matrix key={currentPatternIndex} {...matrixProps} frames={currentFrames} />
}

export function Matrix({
  rows,
  cols,
  pattern,
  frames,
  fps = 12,
  autoplay = true,
  loop = true,
  size = 10,
  gap = 2,
  palette,
  brightness = 1,
  ariaLabel,
  onFrame,
  mode = "default",
  levels,
  className,
  ...props
}: MatrixProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const accumulatedTimeRef = useRef<number>(0)

  // Determine which frame to display
  const displayFrame = useMemo(() => {
    if (mode === "vu" && levels) {
      return vu(cols, levels)
    }
    if (pattern) {
      return pattern
    }
    if (frames && frames.length > 0) {
      return frames[currentFrameIndex] || frames[0]
    }
    // Default empty frame
    return Array(rows).fill(null).map(() => Array(cols).fill(0))
  }, [mode, levels, pattern, frames, currentFrameIndex, rows, cols])

  // Default palette with theme support
  const defaultPalette: MatrixPalette = useMemo(() => ({
    on: "currentColor",
    off: "hsl(var(--muted-foreground))",
  }), [])

  const finalPalette = palette || defaultPalette

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    if (!frames || frames.length === 0 || !autoplay) {
      return
    }

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime
      }

      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime
      accumulatedTimeRef.current += deltaTime

      const frameDuration = 1000 / fps
      if (accumulatedTimeRef.current >= frameDuration) {
        accumulatedTimeRef.current = 0
        setCurrentFrameIndex((prev) => {
          const next = prev + 1
          if (next >= frames.length) {
            if (loop) {
              onFrame?.(0)
              return 0
            } else {
              onFrame?.(frames.length - 1)
              return frames.length - 1
            }
          }
          onFrame?.(next)
          return next
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      lastTimeRef.current = 0
      accumulatedTimeRef.current = 0
    }
  }, [frames, fps, autoplay, loop, onFrame])

  // Precompute cell positions for performance
  const cells = useMemo(() => {
    const result: Array<{ row: number; col: number; x: number; y: number }> = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result.push({
          row,
          col,
          x: col * (size + gap),
          y: row * (size + gap),
        })
      }
    }
    return result
  }, [rows, cols, size, gap])

  const totalWidth = cols * size + (cols - 1) * gap
  const totalHeight = rows * size + (rows - 1) * gap

  return (
    <div
      className={cn("inline-block", className)}
      role="img"
      aria-label={ariaLabel}
      aria-live={frames ? "polite" : undefined}
      {...props}
    >
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {cells.map((cell, index) => {
          const brightnessValue = displayFrame[cell.row]?.[cell.col] ?? 0
          const finalBrightness = Math.max(0, Math.min(1, brightnessValue * brightness))
          
          // Use off color when brightness is 0, otherwise interpolate
          const fillColor = finalBrightness === 0 
            ? finalPalette.off 
            : finalPalette.on
          const opacity = finalBrightness === 0 ? 1 : finalBrightness

          return (
            <circle
              key={index}
              cx={cell.x + size / 2}
              cy={cell.y + size / 2}
              r={size / 2}
              fill={fillColor}
              opacity={opacity}
              style={{
                transition: "opacity 0.1s ease, fill 0.1s ease",
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
