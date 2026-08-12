// Server-side GitHub contributions fetcher. Used by app/page.tsx during
// rendering. Requires GH_TOKEN — hits GitHub's authenticated GraphQL, which
// includes private contributions. Without a token (or on any failure) this
// returns an empty set and the calendar/sparkline sections don't render.
//
// There used to be an unauthenticated fallback to
// github-contributions-api.deno.dev; that service now 404s, so it was removed
// rather than left as a silent no-op.

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

const EMPTY: ContributionsResult = { contributions: [], totalContributions: 0 }

export async function getContributions(): Promise<ContributionsResult> {
  const token = process.env.GH_TOKEN
  if (!token) {
    console.warn("[getContributions] GH_TOKEN not set — skipping contribution sections")
    return EMPTY
  }
  try {
    return await fetchAuthenticated(token)
  } catch (err) {
    console.error("[getContributions] failed:", err)
    return EMPTY
  }
}
