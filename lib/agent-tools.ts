import { openSourceData } from "@/lib/open-source"
import { projects } from "@/lib/projects"

// Read-only tools this site exposes to browser agents through WebMCP. The
// /developers page lists the same definitions, so the docs can't drift.

interface ToolResult {
  content: { type: "text"; text: string }[]
}

export interface AgentTool {
  name: string
  description: string
  inputSchema: { type: "object"; properties: Record<string, unknown> }
  execute: (input: Record<string, unknown>) => Promise<ToolResult>
}

function text(value: string): ToolResult {
  return { content: [{ type: "text", text: value }] }
}

export const agentTools: AgentTool[] = [
  {
    name: "get_profile",
    description:
      "Aditya Garud's profile as Markdown: who he is, his projects, open source totals, blog posts and contact links.",
    inputSchema: { type: "object", properties: {} },
    execute: async () => text(await (await fetch("/index.md")).text()),
  },
  {
    name: "list_projects",
    description: "Aditya's own projects with descriptions, tech stack, source repo and live URL.",
    inputSchema: { type: "object", properties: {} },
    execute: async () =>
      text(
        JSON.stringify(
          projects.map((p) => ({
            title: p.title,
            description: p.description,
            stack: p.stack.map((t) => t.name),
            repo: p.repo,
            live: p.live,
          })),
        ),
      ),
  },
  {
    name: "list_merged_prs",
    description:
      "Every pull request Aditya has had merged into other people's open source projects (Cap, Gumroad, T3 Code, Omarchy and more), with links.",
    inputSchema: {
      type: "object",
      properties: {
        org: {
          type: "string",
          description: "Only this organization or project, e.g. \"cap\" or \"gumroad\". Omit for all.",
        },
      },
    },
    execute: async ({ org }) => {
      const query = typeof org === "string" ? org.toLowerCase() : ""
      const orgs = openSourceData.filter(
        (o) => !query || [o.key, o.name, o.label].some((s) => s.toLowerCase().includes(query)),
      )
      return text(
        JSON.stringify(
          orgs.flatMap((o) =>
            o.repos.flatMap((r) =>
              r.prs.map((pr) => ({
                project: o.name,
                repo: r.repo,
                title: pr.title,
                url: `https://github.com/${r.repo}/pull/${pr.num}`,
              })),
            ),
          ),
        ),
      )
    },
  },
]
