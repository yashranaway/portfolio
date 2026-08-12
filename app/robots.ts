import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

// Replaces the old static public/robots.txt, which hardcoded the sitemap URL
// and would have kept pointing at the previous domain after the migration.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
