import type { MDXComponents } from "mdx/types"

import Callout from "@/components/mdx/Callout"
import Figure from "@/components/mdx/Figure"
import Mermaid from "@/components/mdx/Mermaid"
import SmokeText from "@/components/mdx/SmokeText"

// Next.js picks this file up automatically for the MDX component mapping.
// Prose styling comes from @tailwindcss/typography on the wrapping <article>;
// these overrides only handle what typography can't infer.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Available in any .mdx file without importing them.
    Callout,
    Figure,
    Mermaid,
    SmokeText,
    a: ({ href = "", children, ...props }) => {
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...props}
        >
          {children}
        </a>
      )
    },
    // rehype-slug adds ids; make headings linkable without extra markup.
    h2: ({ id, children, ...props }) => (
      <h2 id={id} {...props}>
        {id ? (
          <a href={`#${id}`} className="no-underline hover:underline">
            {children}
          </a>
        ) : (
          children
        )}
      </h2>
    ),
    ...components,
  }
}
