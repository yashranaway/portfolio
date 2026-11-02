import type { Metadata } from "next"
import Link from "next/link"

import { agentTools } from "@/lib/agent-tools"
import { SITE_URL } from "@/lib/site"

const description =
  "Machine-readable endpoints and WebMCP tools for agents reading adityagarud.com. Public, read-only, no keys."

export const metadata: Metadata = {
  title: "Developers",
  description,
  alternates: { canonical: `${SITE_URL}/developers` },
}

const endpoints = [
  { path: "/llms.txt", what: "Site index for language models: profile, projects, open source, posts, contact." },
  { path: "/index.md", what: "The same index as text/markdown. The homepage's Link header points here." },
  { path: "/feed.xml", what: "RSS feed of blog posts." },
  { path: "/sitemap.xml", what: "Every public page with its last-modified date." },
  { path: "/.well-known/oauth-protected-resource", what: "RFC 9728 metadata stating that nothing here needs auth." },
]

const linkClass = "text-zinc-900 underline-offset-4 hover:underline dark:text-white"
const headingClass = "mt-12 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500"

export default function Developers() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-white">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <Link
          href="/"
          className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          ← back
        </Link>

        <h1 className="mt-6 text-3xl font-light sm:text-4xl">Developers</h1>
        <p className="mt-3 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          This is a personal site, so there&apos;s no product API. Everything below is public and
          read-only: no sign-up, no API keys, no rate plan. Point your agent at it directly.
        </p>

        <h2 className={headingClass}>Quickstart</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white/50 p-4 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900/50">
          {`curl ${SITE_URL}/llms.txt\ncurl ${SITE_URL}/feed.xml`}
        </pre>

        <h2 className={headingClass}>Endpoints</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {endpoints.map(({ path, what }) => (
            <li key={path}>
              <a href={path} className={`font-mono ${linkClass}`}>
                {path}
              </a>
              <span className="text-zinc-600 dark:text-zinc-400"> · {what}</span>
            </li>
          ))}
        </ul>

        <h2 className={headingClass}>WebMCP tools</h2>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Every page registers these with <code className="font-mono">document.modelContext</code>, so
          a browser agent with WebMCP can call them without scraping. All are read-only.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {agentTools.map((tool) => (
            <li key={tool.name}>
              <code className="font-mono text-zinc-900 dark:text-white">{tool.name}</code>
              <span className="text-zinc-600 dark:text-zinc-400"> · {tool.description}</span>
            </li>
          ))}
        </ul>

        <h2 className={headingClass}>Structured data</h2>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Every page carries schema.org JSON-LD for Person, WebSite, ProfilePage and the project
          list. Blog posts add BlogPosting.
        </p>
      </div>
    </main>
  )
}
