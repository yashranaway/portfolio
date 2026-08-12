import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "./theme-provider"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { projects } from "@/lib/projects"
import { SITE_URL } from "@/lib/site"

// Search-engine ownership tokens. Set these in Vercel → Settings → Environment
// Variables, then redeploy; the meta tags only render once a value exists, so an
// unset var can't emit content="undefined" and fail verification.
//   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION — Google Search Console (HTML tag method)
//   NEXT_PUBLIC_BING_SITE_VERIFICATION   — Bing Webmaster Tools (msvalidate.01)
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION

const verification: Metadata["verification"] = {
  ...(googleVerification ? { google: googleVerification } : {}),
  ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aditya Garud - Full Stack Developer & Machine Learning Engineer",
    template: "%s | Aditya Garud",
  },
  description:
    "Aditya Garud is a Full Stack Developer and Machine Learning Engineer specializing in AI, web development, and computer vision. Technical Lead at TekLingo, studying at Vishwakarma University, Pune.",
  keywords: [
    "Aditya Garud",
    "Full Stack Developer",
    "Machine Learning Engineer",
    "AI Developer",
    "Web Development",
    "React Developer",
    "Next.js Developer",
    "Python Developer",
    "TekLingo",
    "Vishwakarma University",
    "Pune Developer",
    "Computer Vision",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Discord Bot Developer",
    "LSTM",
    "NLP",
    "Technical Lead",
  ],
  authors: [{ name: "Aditya Garud", url: "https://github.com/yashranaway" }],
  creator: "Aditya Garud",
  publisher: "Aditya Garud",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Aditya Garud Portfolio",
    title: "Aditya Garud - Full Stack Developer & Machine Learning Engineer",
    description:
      "Full Stack Developer and Machine Learning Engineer specializing in AI, web development, and computer vision. Technical Lead at TekLingo.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aditya Garud - Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Garud - Full Stack Developer & Machine Learning Engineer",
    description:
      "Full Stack Developer and Machine Learning Engineer specializing in AI, web development, and computer vision.",
    creator: "@yashranaway",
    site: "@yashranaway",
    images: ["/og-image.png"],
  },
  // Each entry points at a file that is actually that size. Previously every
  // slot served the same 736x736 / 192 KB PNG with invented `sizes` values, so
  // browsers downloaded 192 KB to paint a 16px tab icon.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  applicationName: "Aditya Garud Portfolio",
  referrer: "origin-when-cross-origin",
  category: "technology",
  ...(Object.keys(verification).length > 0 ? { verification } : {}),
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#fafafa" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
  }
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Aditya Garud",
    givenName: "Aditya",
    familyName: "Garud",
    url: SITE_URL,
    image: "https://github.com/yashranaway.png",
    email: "mailto:garudaditya079@gmail.com",
    jobTitle: "Full Stack Developer & Machine Learning Engineer",
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer & Machine Learning Engineer",
      occupationLocation: { "@type": "City", name: "Pune" },
      skills: [
        "Machine Learning",
        "Artificial Intelligence",
        "Computer Vision",
        "Web Development",
        "React",
        "Next.js",
        "Python",
        "TypeScript",
      ],
    },
    worksFor: {
      "@type": "Organization",
      name: "TekLingo",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Vishwakarma University",
      url: "https://www.vupune.ac.in/",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    nationality: { "@type": "Country", name: "India" },
    knowsLanguage: ["English", "Hindi", "Marathi"],
    sameAs: [
      "https://github.com/yashranaway",
      "https://www.linkedin.com/in/aditya-garud-8b633a303",
      "https://x.com/yashranaway",
    ],
    knowsAbout: [
      "Machine Learning",
      "Artificial Intelligence",
      "Web Development",
      "Python",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "TensorFlow",
      "PyTorch",
      "Computer Vision",
      "Natural Language Processing",
    ],
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Aditya Garud",
    description:
      "Portfolio of Aditya Garud — Full Stack Developer and Machine Learning Engineer in Pune.",
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#person` },
  }

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: SITE_URL,
    name: "Aditya Garud — Full Stack Developer & Machine Learning Engineer",
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
  }

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Aditya Garud",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: p.title,
        description: p.description,
        ...(p.repo ? { codeRepository: p.repo, url: p.repo } : {}),
        programmingLanguage: p.stack.map((t) => t.name),
        author: { "@id": `${SITE_URL}/#person` },
      },
    })),
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
        />
      </head>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
