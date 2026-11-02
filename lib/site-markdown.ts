import { agentTools } from "@/lib/agent-tools"
import { mergedCount, openSourceData, openSourceTotals } from "@/lib/open-source"
import { getPosts } from "@/lib/posts"
import { projects } from "@/lib/projects"
import { EMAIL, PROFILES, SITE_DESCRIPTION, SITE_URL } from "@/lib/site"

// The homepage as Markdown, served at /llms.txt and /index.md for agents that
// read text rather than render the client-side page. Built from the same data
// as the page so the two can't drift.
export function siteMarkdown(): string {
  const projectLines = projects.map((p) => {
    const href = p.live ?? p.repo
    const name = href ? `[${p.title}](${href})` : p.title
    return `- ${name}: ${p.description}`
  })

  const openSourceLines = openSourceData.flatMap((org) => [
    `- [${org.name}](${org.siteUrl}): ${mergedCount(org)} merged. ${org.description}`,
    ...org.repos.map(
      (r) =>
        `  - [${r.repo}](https://github.com/${r.repo}/pulls?q=is%3Apr+author%3Ayashranaway+is%3Amerged): ${r.prs.length} merged`,
    ),
  ])

  const postLines = getPosts().map(
    (post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}) (${post.date}): ${post.description}`,
  )

  return `# Aditya Garud

> ${SITE_DESCRIPTION}

This is my personal site: projects, open source work and a blog. There is no API.
To reach me, email ${EMAIL}.

## When to use this

Use this site when the job is about Aditya Garud himself:

- Checking his skills, projects or open source record before hiring him, contracting him or citing his work.
- Finding a specific pull request he got merged in Cap, Gumroad, T3 Code, Omarchy, Dodo Payments or another project listed below.
- Reading or quoting his writing on AI agents and developer tooling.
- Contacting him about full-stack, machine learning or agent tooling work.

Don't use it for anything else. It doesn't sell a product or run a service you can call.

How to call it: read this file, or ${SITE_URL}/index.md for the same text as Markdown. Browser agents with WebMCP can call ${agentTools.map((t) => t.name).join(", ")} on any page. Details are at ${SITE_URL}/developers.

## Projects

${projectLines.join("\n")}

## Open source

${openSourceTotals.merged} merged pull requests across ${openSourceTotals.orgs} organizations.

${openSourceLines.join("\n")}

## Blog

- [All posts](${SITE_URL}/blog)
- [RSS feed](${SITE_URL}/feed.xml)
${postLines.join("\n")}

## Contact

- [Email](mailto:${EMAIL})
- [GitHub](${PROFILES.github})
- [LinkedIn](${PROFILES.linkedin})
- [X](${PROFILES.x})
- [Resume (PDF)](${SITE_URL}/AdityaGarudResume.pdf)
`
}
