import { ImageResponse } from "next/og"

import { getPost, getPosts, formatDate } from "@/lib/posts"

// Without this the route is server-rendered on demand, so the first social
// crawler to hit a post pays the render cost. Prerendering makes every card a
// static file.
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

// Next picks this file up by convention and injects the resulting og:image /
// twitter:image tags for the post route, so generateMetadata doesn't set them.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Blog post by Aditya Garud"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  const title = post?.title ?? "Aditya Garud"
  const meta = post ? `${formatDate(post.date)}  ·  ${post.readingMinutes} min read` : ""

  // Long titles need to shrink or they overflow the card.
  const titleSize = title.length > 60 ? 60 : title.length > 40 ? 72 : 84

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#71717a",
            }}
          >
            Blog
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: titleSize,
              lineHeight: 1.1,
              color: "#ffffff",
              // Keep the card readable rather than letting a long title fill it.
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 28,
            fontSize: 24,
            color: "#a1a1aa",
          }}
        >
          <span>adityagarud.com</span>
          <span>{meta}</span>
        </div>
      </div>
    ),
    size
  )
}
