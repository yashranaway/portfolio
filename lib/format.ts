// Pure helpers, safe to import from client components.
//
// Kept out of lib/posts.ts on purpose: that module imports node:fs at the top
// level, so importing any runtime value from it into a client component would
// pull fs into the browser bundle and break the build.

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
