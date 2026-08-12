import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import { formatDate, tagSlug } from "@/lib/format"

// Posts are plain .mdx files in content/blog/. No content framework: at this
// scale a directory read plus gray-matter does everything Contentlayer/Velite
// would, without a build step. Revisit if this grows past ~100 posts.

export const POSTS_DIR = path.join(process.cwd(), "content", "blog")

export interface PostMeta {
  slug: string
  title: string
  description: string
  /** ISO date (YYYY-MM-DD) from frontmatter. */
  date: string
  tags: string[]
  draft: boolean
  /** Estimated read time in minutes, derived from word count. */
  readingMinutes: number
  /** Optional hero image under /public. Also overrides the generated OG card. */
  image?: string
  imageAlt?: string
}

const WORDS_PER_MINUTE = 200

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

function parse(slug: string): PostMeta | null {
  const file = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, "utf8"))
  if (!data.title || !data.date) return null
  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ""),
    date: String(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingMinutes: readingMinutes(content),
    ...(data.image ? { image: String(data.image) } : {}),
    ...(data.imageAlt ? { imageAlt: String(data.imageAlt) } : {}),
  }
}

/** All publishable posts, newest first. Drafts are excluded in production. */
export function getPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  const showDrafts = process.env.NODE_ENV === "development"
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parse(f.replace(/\.mdx$/, "")))
    .filter((p): p is PostMeta => p !== null)
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): PostMeta | null {
  const post = parse(slug)
  if (!post) return null
  if (post.draft && process.env.NODE_ENV !== "development") return null
  return post
}

export interface TagCount {
  tag: string
  /** URL-safe form used in /blog/tags/[tag]. */
  slug: string
  count: number
}

/** Every tag in use, most-used first, then alphabetical. */
export function getTags(): TagCount[] {
  const counts = new Map<string, number>()
  for (const post of getPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getPostsByTag(slug: string): PostMeta[] {
  return getPosts().filter((post) => post.tags.some((t) => tagSlug(t) === slug))
}

// Re-exported so server modules can keep importing from one place.
export { formatDate, tagSlug }
