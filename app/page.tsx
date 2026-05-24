import { Portfolio } from "@/components/portfolio"
import { getContributions } from "@/lib/github"

// Re-render the page server-side at most once per hour. Visitors get a
// fully-formed HTML response with the live contribution count baked in.
export const revalidate = 3600

export default async function Page() {
  const { contributions } = await getContributions()
  return <Portfolio contributions={contributions} />
}
