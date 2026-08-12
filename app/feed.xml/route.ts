import { getPosts } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"

// RSS 2.0 feed at /feed.xml. Still how most developers subscribe.
export const dynamic = "force-static"

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function GET(): Response {
  const posts = getPosts()
  const updated = posts[0]?.date

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Aditya Garud</title>
    <link>${SITE_URL}/blog</link>
    <description>Machine learning, agents, and shipping software.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${
      updated ? `\n    <lastBuildDate>${new Date(`${updated}T00:00:00Z`).toUTCString()}</lastBuildDate>` : ""
    }
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  })
}
