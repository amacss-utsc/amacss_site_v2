import { LeaderboardPage } from "@/components/Leaderboard/Page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events Leaderboard",
}

export default function Page() {
  return <LeaderboardPage />
}
