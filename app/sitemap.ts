import type { MetadataRoute } from "next"

import { getPosts, getTags } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"

// Bump this when the homepage content meaningfully changes.
//
// This was `new Date()`, which stamped every deploy — including no-op ones — as
// a fresh modification. Google discounts lastmod entirely when it sees it move
// without the content moving with it, so an honest fixed date is worth more
// than an automatic one. Posts carry their own dates, so they don't need it.
const LAST_CONTENT_UPDATE = "2026-08-12"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()

  return [
    {
      url: SITE_URL,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0]?.date ?? LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    // Tag pages are thin by nature, so they sit below posts in priority.
    ...getTags().map(({ slug }) => ({
      url: `${SITE_URL}/blog/tags/${slug}`,
      lastModified: posts[0]?.date ?? LAST_CONTENT_UPDATE,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ]
}
