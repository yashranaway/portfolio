// Single source of truth for the site's origin.
//
// This used to be hardcoded in 18 places across layout.tsx, sitemap.ts,
// robots.txt and CodeHover.tsx — mostly JSON-LD @id values, where a stale URL
// silently breaks the entity graph rather than erroring. Changing domains is
// now a one-line edit here.
export const SITE_URL = "https://adityagarud.com"

/** Bare host, for display and for schema.org identifiers. */
export const SITE_DOMAIN = "adityagarud.com"

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = ""): string {
  return path ? `${SITE_URL}/${path.replace(/^\//, "")}` : SITE_URL
}

export const SITE_DESCRIPTION =
  "Aditya Garud is a Full Stack Developer and Machine Learning Engineer specializing in AI, web development, and computer vision. Based in Pune."

export const EMAIL = "garudaditya079@gmail.com"

export const PROFILES = {
  github: "https://github.com/yashranaway",
  linkedin: "https://www.linkedin.com/in/aditya-garud-8b633a303",
  x: "https://x.com/yashranaway",
}
