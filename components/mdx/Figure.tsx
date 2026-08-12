import type { ReactNode } from "react"

interface FigureProps {
  /** Image path under /public, e.g. "/blog/latency-chart.png". */
  src?: string
  /** Describes the image for screen readers. Required when `src` is used. */
  alt?: string
  caption: ReactNode
  width?: number
  height?: number
  /** Wrap arbitrary content (a chart, a table) instead of an image. */
  children?: ReactNode
}

/**
 * Usage in MDX:
 *   <Figure src="/blog/chart.png" alt="p95 latency by week" caption="Latency after the cache change." />
 *   <Figure caption="Throughput comparison"><SomeChart /></Figure>
 *
 * Plain <img> rather than next/image: MDX authors pass arbitrary paths, and
 * next/image needs known dimensions or a configured loader to avoid layout
 * shift. Width/height are passed through when known so the browser can reserve
 * space itself.
 */
export default function Figure({ src, alt, caption, width, height, children }: FigureProps) {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50">
        {src ? (
          <img
            src={src}
            alt={alt ?? ""}
            width={width}
            height={height}
            loading="lazy"
            className="block h-auto w-full"
          />
        ) : (
          children
        )}
      </div>
      <figcaption className="mt-3 text-center font-mono text-xs leading-relaxed text-zinc-500">
        {caption}
      </figcaption>
    </figure>
  )
}
