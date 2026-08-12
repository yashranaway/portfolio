import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PostList from "@/components/PostList"
import { getPostsByTag, getTags } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export function generateStaticParams() {
  return getTags().map(({ slug }) => ({ tag: slug }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const match = getTags().find((t) => t.slug === tag)
  if (!match) return {}

  const title = `Posts tagged “${match.tag}”`
  const description = `${match.count} post${match.count === 1 ? "" : "s"} tagged ${match.tag} — by Aditya Garud.`
  const url = `${SITE_URL}/blog/tags/${match.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const match = getTags().find((t) => t.slug === tag)
  if (!match) notFound()

  const posts = getPostsByTag(tag)

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-white">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <Link
          href="/blog"
          className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          ← all posts
        </Link>

        <h1 className="mt-6 text-3xl font-light sm:text-4xl">
          <span className="text-zinc-400 dark:text-zinc-600">#</span>
          {match.tag}
        </h1>
        <p className="mt-3 font-mono text-xs text-zinc-500">
          {match.count} post{match.count === 1 ? "" : "s"}
        </p>

        <PostList posts={posts} linkTags={false} />
      </div>
    </main>
  )
}
