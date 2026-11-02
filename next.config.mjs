import createMDX from "@next/mdx"

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  // Shiki themes, picked to sit on the zinc surfaces the site already uses.
  theme: { dark: "github-dark-dimmed", light: "github-light" },
  keepBackground: false,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    root: import.meta.dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Points agents at the plain-text versions of the homepage (RFC 8288).
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: [
              '</sitemap.xml>; rel="sitemap"',
              '</index.md>; rel="alternate"; type="text/markdown"',
              '</llms.txt>; rel="describedby"; type="text/plain"',
            ].join(", "),
          },
        ],
      },
    ]
  },
}

// Plugins must be named as strings, not imported functions: Turbopack requires
// serializable loader options, and a function reference can't be serialized.
const withMDX = createMDX({
  options: {
    // remark-frontmatter must come first: @next/mdx does not strip YAML on its
    // own, so without it the --- block renders as visible body text. gray-matter
    // only strips it in lib/posts.ts, which is a separate read for metadata.
    remarkPlugins: [["remark-frontmatter"], ["remark-gfm"]],
    rehypePlugins: [["rehype-slug"], ["rehype-pretty-code", prettyCodeOptions]],
  },
})

export default withMDX(nextConfig)
