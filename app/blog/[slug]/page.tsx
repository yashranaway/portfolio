import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import CodeCopyButtons from "@/components/CodeCopyButtons"
import ReadingProgress from "@/components/ReadingProgress"
import TableOfContents from "@/components/TableOfContents"
import { getPost, getPosts, formatDate } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"
import { getToc } from "@/lib/toc"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ["Aditya Garud"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { default: Content } = await import(`@/content/blog/${slug}.mdx`)
  const toc = getToc(slug)

  // Posts are sorted newest-first, so the *previous* entry is the newer post.
  const all = getPosts()
  const index = all.findIndex((p) => p.slug === slug)
  const newer = index > 0 ? all[index - 1] : null
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}#post`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ReadingProgress targetId="post-body" />
      <CodeCopyButtons />

      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-20">
        {/* Centre column is fixed-width; the TOC rail sits beside it and only
            appears once there is room, so the prose column never shifts. */}
        <div className="mx-auto flex max-w-6xl justify-center gap-12">
          <div className="w-full max-w-3xl min-w-0">
            <Link
              href="/blog"
              className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              ← all posts
            </Link>

            <header className="mt-6">
              <h1 className="text-3xl leading-tight font-light sm:text-4xl">{post.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{post.readingMinutes} min read</span>
                {post.draft && (
                  <>
                    <span>·</span>
                    <span className="text-amber-500">draft</span>
                  </>
                )}
              </div>
              {post.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-zinc-200 px-2.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </header>

            {/* Inline TOC for narrow screens, where the rail is hidden. */}
            {toc.length >= 2 && (
              <details className="mt-8 rounded-lg border border-zinc-200 p-4 lg:hidden dark:border-zinc-700">
                <summary className="cursor-pointer font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  On this page
                </summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {toc.map((entry) => (
                    <li key={entry.id} className={entry.depth === 3 ? "pl-4" : undefined}>
                      <a
                        href={`#${entry.id}`}
                        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <article
              id="post-body"
              className="prose prose-zinc dark:prose-invert mt-10 max-w-none scroll-mt-24 prose-headings:font-medium prose-headings:scroll-mt-24 prose-a:underline-offset-4 prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-white dark:prose-pre:border-zinc-700 dark:prose-pre:bg-zinc-800/80"
            >
              <Content />
            </article>

            {(newer || older) && (
              <nav className="mt-16 grid gap-4 border-t border-zinc-200 pt-8 sm:grid-cols-2 dark:border-zinc-700">
                {newer ? (
                  <Link href={`/blog/${newer.slug}`} className="group">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                      Newer
                    </span>
                    <span className="mt-1 block text-sm text-zinc-900 group-hover:underline underline-offset-4 dark:text-white">
                      {newer.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {older && (
                  <Link href={`/blog/${older.slug}`} className="group sm:text-right">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                      Older
                    </span>
                    <span className="mt-1 block text-sm text-zinc-900 group-hover:underline underline-offset-4 dark:text-white">
                      {older.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-20">
              <TableOfContents entries={toc} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
