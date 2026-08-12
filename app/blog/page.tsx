import type { Metadata } from "next"
import Link from "next/link"

import PostList from "@/components/PostList"
import { getPosts, getTags } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on machine learning, agents, and shipping software — by Aditya Garud.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog | Aditya Garud",
    description:
      "Writing on machine learning, agents, and shipping software — by Aditya Garud.",
  },
}

export default function BlogIndex() {
  const posts = getPosts()
  const tags = getTags()

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-white">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <Link
          href="/"
          className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          ← back
        </Link>

        <h1 className="mt-6 text-3xl font-light sm:text-4xl">Blog</h1>
        <p className="mt-3 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          Machine learning, agents, and things I probably shouldn&apos;t have shipped.
        </p>

        {tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {tags.map(({ tag, slug, count }) => (
              <li key={slug}>
                <Link
                  href={`/blog/tags/${slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 font-mono text-[11px] text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
                >
                  <span>#{tag}</span>
                  <span className="text-zinc-400 tabular-nums dark:text-zinc-500">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <PostList posts={posts} />

        <p className="mt-16 border-t border-zinc-200 pt-6 font-mono text-xs text-zinc-500 dark:border-zinc-700">
          <a href="/feed.xml" className="hover:text-zinc-900 dark:hover:text-white">
            RSS feed →
          </a>
        </p>
      </div>
    </main>
  )
}
