// Server-side GitHub contributions fetcher. Used by app/page.tsx during
// rendering. With GH_TOKEN set, hits GitHub's authenticated GraphQL and
// includes private contributions. Without a token, falls back to the
// public deno API so the page still renders.

export interface Contribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface ContributionsResult {
  contributions: Contribution[]
  totalContributions: number
}

const LOGIN = "yashranaway"

const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

async function fetchAuthenticated(token: string): Promise<ContributionsResult> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "aditya-garud-portfolio",
    },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
    next: { revalidate: 3600 },
  })
  if (!res.ok) {
    throw new Error(`GitHub GraphQL HTTP ${res.status}: ${await res.text()}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`)
  }
  const cal = json.data.user.contributionsCollection.contributionCalendar
  const contributions: Contribution[] = cal.weeks.flatMap(
    (w: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVEL_MAP[d.contributionLevel] ?? 0,
      })),
  )
  return { contributions, totalContributions: cal.totalContributions }
}

async function fetchPublic(): Promise<ContributionsResult> {
  const res = await fetch(`https://github-contributions-api.deno.dev/${LOGIN}.json`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Deno API HTTP ${res.status}`)
  const data = await res.json()
  const all = (data.contributions || [])
    .flat()
    .filter(
      (i: unknown): i is { date: string; contributionCount: number; contributionLevel: string } =>
        !!i &&
        typeof i === "object" &&
        "date" in i &&
        "contributionCount" in i &&
        "contributionLevel" in i,
    )
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const filtered = all
    .filter((i: { date: string }) => new Date(i.date) >= oneYearAgo)
    .map((i: { date: string; contributionCount: number; contributionLevel: string }) => ({
      date: i.date,
      count: Number(i.contributionCount || 0),
      level: LEVEL_MAP[i.contributionLevel] ?? 0,
    }))
  const total = filtered.reduce((sum: number, i: Contribution) => sum + i.count, 0)
  return { contributions: filtered, totalContributions: total }
}

export async function getContributions(): Promise<ContributionsResult> {
  const token = process.env.GH_TOKEN
  try {
    if (token) return await fetchAuthenticated(token)
    return await fetchPublic()
  } catch (err) {
    console.error("[getContributions] failed:", err)
    return { contributions: [], totalContributions: 0 }
  }
}
