import Link from "next/link"

import { formatDate, tagSlug } from "@/lib/format"
import type { PostMeta } from "@/lib/posts"

interface PostListProps {
  posts: PostMeta[]
  /** Render tags as links. Off on tag pages, where they'd be circular. */
  linkTags?: boolean
}

// Shared between /blog and /blog/tags/[tag] so the two listings can't drift.
export default function PostList({ posts, linkTags = true }: PostListProps) {
  if (posts.length === 0) {
    return <p className="mt-12 font-mono text-sm text-zinc-500">No posts yet.</p>
  }

  return (
    <ul className="mt-10 space-y-8 sm:mt-12">
      {posts.map((post) => (
        <li key={post.slug}>
          <article>
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-lg font-medium underline-offset-4 group-hover:underline sm:text-xl">
                  {post.title}
                </h2>
                <time
                  dateTime={post.date}
                  className="flex-shrink-0 font-mono text-xs text-zinc-500 tabular-nums"
                >
                  {formatDate(post.date)}
                </time>
              </div>
              {post.description && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {post.description}
                </p>
              )}
            </Link>

            <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-zinc-500">
              <span>{post.readingMinutes} min read</span>
              {post.draft && <span className="text-amber-500">draft</span>}
              {post.tags.map((tag) =>
                linkTags ? (
                  <Link
                    key={tag}
                    href={`/blog/tags/${tagSlug(tag)}`}
                    className="hover:text-zinc-900 dark:hover:text-white"
                  >
                    #{tag}
                  </Link>
                ) : (
                  <span key={tag}>#{tag}</span>
                )
              )}
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
