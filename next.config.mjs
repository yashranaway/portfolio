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
}

// Plugins must be named as strings, not imported functions: Turbopack requires
// serializable loader options, and a function reference can't be serialized.
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm"]],
    rehypePlugins: [["rehype-slug"], ["rehype-pretty-code", prettyCodeOptions]],
  },
})

export default withMDX(nextConfig)
