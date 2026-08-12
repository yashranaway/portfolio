import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

// Bump this when the page content meaningfully changes.
//
// This was `new Date()`, which stamped every deploy — including no-op ones — as
// a fresh modification. Google discounts lastmod entirely when it sees it move
// without the content moving with it, so an honest fixed date is worth more
// than an automatic one.
const LAST_CONTENT_UPDATE = "2026-08-12"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
