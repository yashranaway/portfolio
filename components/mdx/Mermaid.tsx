"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface MermaidProps {
  chart: string
  /** Optional caption rendered under the diagram. */
  caption?: string
}

/**
 * Usage in MDX:
 *   <Mermaid chart={`
 *     flowchart LR
 *       A[Plan] --> B[Build]
 *   `} />
 *
 * mermaid is ~500 KB, so it is imported inside the effect rather than at module
 * scope. Pages without a diagram never load it.
 */
export default function Mermaid({ chart, caption }: MermaidProps) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string>("")
  const [failed, setFailed] = useState(false)
  const reactId = useId()
  // Mermaid ids must be valid CSS selectors; React's useId contains colons.
  const idRef = useRef(`mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
          themeVariables:
            resolvedTheme === "dark"
              ? {
                  background: "transparent",
                  primaryColor: "#27272a",
                  primaryTextColor: "#fafafa",
                  primaryBorderColor: "#52525b",
                  lineColor: "#71717a",
                  secondaryColor: "#18181b",
                  tertiaryColor: "#18181b",
                }
              : {
                  background: "transparent",
                  primaryColor: "#f4f4f5",
                  primaryTextColor: "#18181b",
                  primaryBorderColor: "#d4d4d8",
                  lineColor: "#a1a1aa",
                  secondaryColor: "#fafafa",
                  tertiaryColor: "#fafafa",
                },
        })
        const { svg } = await mermaid.render(idRef.current, chart.trim())
        if (!cancelled) setSvg(svg)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [chart, resolvedTheme])

  if (failed) {
    // Better to show the source than an empty box.
    return (
      <pre className="not-prose my-6 overflow-x-auto rounded-lg border border-zinc-200 p-4 font-mono text-xs dark:border-zinc-700">
        {chart.trim()}
      </pre>
    )
  }

  return (
    <figure className="not-prose my-8">
      <div
        className="flex justify-center overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-700 dark:bg-zinc-800/50 [&_svg]:h-auto [&_svg]:max-w-full"
        // Mermaid output is generated from author-controlled MDX, and mermaid
        // runs with securityLevel "strict", which strips script and event
        // handlers from the rendered SVG.
        dangerouslySetInnerHTML={{ __html: svg }}
        // Reserve space so the diagram does not shift content when it appears.
        style={svg ? undefined : { minHeight: 160 }}
      />
      {caption && (
        <figcaption className="mt-3 text-center font-mono text-xs text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
