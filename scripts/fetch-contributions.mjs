#!/usr/bin/env node
// Fetch the GitHub contribution calendar at build time and write
// lib/contributions.json. With GH_CONTRIBUTIONS_TOKEN set, hits GitHub's
// GraphQL API and includes private contributions (if the token's owner
// has "Include private contributions on my profile" enabled). Without a
// token, falls back to the public deno API so local dev still works.

import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, "..", "lib", "contributions.json")

const LOGIN = "yashranaway"

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

async function fetchAuthenticated(token) {
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
      "User-Agent": "aditya-garud-portfolio-build",
    },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  })
  if (!res.ok) {
    throw new Error(`GitHub GraphQL HTTP ${res.status}: ${await res.text()}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`)
  }
  const cal = json.data.user.contributionsCollection.contributionCalendar
  const contributions = cal.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVEL_MAP[d.contributionLevel] ?? 0,
    })),
  )
  return { contributions, totalContributions: cal.totalContributions }
}

async function fetchPublic() {
  const res = await fetch(`https://github-contributions-api.deno.dev/${LOGIN}.json`)
  if (!res.ok) throw new Error(`Deno API HTTP ${res.status}`)
  const data = await res.json()
  const all = (data.contributions || [])
    .flat()
    .filter(
      (i) => i && i.date && "contributionCount" in i && "contributionLevel" in i,
    )
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const filtered = all
    .filter((i) => new Date(i.date) >= oneYearAgo)
    .map((i) => ({
      date: i.date,
      count: Number(i.contributionCount || 0),
      level: LEVEL_MAP[i.contributionLevel] ?? 0,
    }))
  const total = filtered.reduce((sum, i) => sum + i.count, 0)
  return { contributions: filtered, totalContributions: total }
}

async function main() {
  const token = process.env.GH_CONTRIBUTIONS_TOKEN
  let result
  let source
  try {
    if (token) {
      source = "github graphql (authenticated, includes private)"
      result = await fetchAuthenticated(token)
    } else {
      source = "deno api (public only — set GH_CONTRIBUTIONS_TOKEN for private)"
      result = await fetchPublic()
    }
  } catch (err) {
    console.error(`[contributions] fetch failed: ${err.message}`)
    console.error("[contributions] writing empty stub so build still succeeds")
    result = { contributions: [], totalContributions: 0 }
    source = "empty stub (fetch failed)"
  }
  const payload = {
    ...result,
    generatedAt: new Date().toISOString(),
  }
  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2) + "\n")
  console.log(
    `[contributions] source: ${source}\n[contributions] wrote ${result.contributions.length} days, total=${result.totalContributions}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
