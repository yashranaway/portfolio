import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getPost, getPosts, formatDate } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"

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

  // Dynamic import so each post's MDX is code-split per route.
  const { default: Content } = await import(`@/content/blog/${slug}.mdx`)

  // Attaches the post to the existing #person entity in layout.tsx rather than
  // declaring a floating author, so the knowledge graph stays connected.
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
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/blog"
          className="font-mono text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          ← all posts
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-light leading-tight">{post.title}</h1>
          <div className="mt-3 flex items-center gap-3 font-mono text-xs text-zinc-500">
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
        </header>

        <article className="prose prose-zinc dark:prose-invert mt-10 max-w-none prose-headings:font-medium prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-700 prose-pre:bg-white dark:prose-pre:bg-zinc-800/80 prose-a:underline-offset-4">
          <Content />
        </article>
      </div>
    </main>
  )
}
