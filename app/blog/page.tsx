import type { Metadata } from "next"
import Link from "next/link"

import { getPosts, formatDate } from "@/lib/posts"
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

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/"
          className="font-mono text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          ← back
        </Link>

        <h1 className="mt-6 text-3xl sm:text-4xl font-light">Blog</h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Machine learning, agents, and things I probably shouldn&apos;t have shipped.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 font-mono text-sm text-zinc-500">No posts yet.</p>
        ) : (
          <ul className="mt-10 sm:mt-12 space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <article>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-medium group-hover:underline underline-offset-4">
                        {post.title}
                      </h2>
                      <time
                        dateTime={post.date}
                        className="font-mono text-xs text-zinc-500 tabular-nums flex-shrink-0"
                      >
                        {formatDate(post.date)}
                      </time>
                    </div>
                    {post.description && (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {post.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-zinc-500">
                      <span>{post.readingMinutes} min read</span>
                      {post.draft && (
                        <span className="text-amber-500">draft</span>
                      )}
                      {post.tags.length > 0 && <span>{post.tags.join(" · ")}</span>}
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
