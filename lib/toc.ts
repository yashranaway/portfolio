import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"
import GithubSlugger from "github-slugger"

import { POSTS_DIR } from "@/lib/posts"

export interface TocEntry {
  id: string
  text: string
  depth: 2 | 3
}

// Headings are extracted from the raw MDX rather than the rendered DOM so the
// table of contents can render on the server with no layout shift.
//
// Uses the same slugger as rehype-slug (github-slugger), so the ids generated
// here match the ids rehype-slug puts on the actual headings.
export function getToc(slug: string): TocEntry[] {
  const file = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return []

  const { content } = matter(fs.readFileSync(file, "utf8"))
  const slugger = new GithubSlugger()
  const entries: TocEntry[] = []

  let inFence = false
  for (const line of content.split("\n")) {
    // Don't treat "# comment" inside a code fence as a heading.
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const depth = match[1].length as 2 | 3
    // Strip inline markdown so the sidebar shows plain text.
    const text = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim()

    entries.push({ id: slugger.slug(text), text, depth })
  }

  return entries
}
