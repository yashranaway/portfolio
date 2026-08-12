import { Portfolio } from "@/components/portfolio"
import { getContributions } from "@/lib/github"
import { getPosts } from "@/lib/posts"

// Re-render the page server-side at most once per hour. Visitors get a
// fully-formed HTML response with the live contribution count baked in.
export const revalidate = 3600

export default async function Page() {
  const { contributions } = await getContributions()
  // Read here rather than in Portfolio: getPosts touches node:fs, and Portfolio
  // is a client component.
  const posts = getPosts().slice(0, 3)
  return <Portfolio contributions={contributions} posts={posts} />
}
