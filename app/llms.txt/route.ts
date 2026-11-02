import { siteMarkdown } from "@/lib/site-markdown"

export const dynamic = "force-static"

export function GET(): Response {
  return new Response(siteMarkdown(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
