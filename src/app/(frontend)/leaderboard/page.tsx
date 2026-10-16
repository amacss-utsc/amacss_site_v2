import { LeaderboardPage } from "@/components/Leaderboard/Page"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events Leaderboard",
}

type MemberProfile = {
  id: string
  full_name: string
  points: number
}

const memberName = (profile: MemberProfile) =>
  profile.full_name.trim() || "AMACSS Member"

export default async function Page() {
  let topAttendees: MemberProfile[] = []
  let currentMember: (MemberProfile & { rank: number }) | null = null

  try {
    const admin = createSupabaseAdminClient()
    const { data: leaderboard, error: leaderboardError } = await admin
      .from("member_profiles")
      .select("id, full_name, points")
      .gt("points", 0)
      .order("points", { ascending: false })
      .order("full_name", { ascending: true })
      .limit(10)

    if (leaderboardError) throw leaderboardError
    topAttendees = (leaderboard ?? []) as MemberProfile[]

    const auth = await createSupabaseServerClient()
    const {
      data: { user },
    } = await auth.auth.getUser()

    if (user) {
      const { data: profile, error: profileError } = await admin
        .from("member_profiles")
        .select("id, full_name, points")
        .eq("id", user.id)
        .maybeSingle()

      if (profileError) throw profileError

      if (profile) {
        const { count, error: rankError } = await admin
          .from("member_profiles")
          .select("id", { count: "exact", head: true })
          .gt("points", profile.points)

        if (rankError) throw rankError
        currentMember = {
          ...(profile as MemberProfile),
          rank: (count ?? 0) + 1,
        }
      }
    }
  } catch (error) {
    // The public page remains available if Supabase is temporarily unavailable.
    console.error("Leaderboard data unavailable:", error)
  }

  return (
    <LeaderboardPage
      topAttendees={topAttendees.map((profile) => ({
        id: profile.id,
        name: memberName(profile),
        points: profile.points,
      }))}
      currentMember={
        currentMember
          ? {
              id: currentMember.id,
              name: memberName(currentMember),
              points: currentMember.points,
              rank: currentMember.rank,
            }
          : null
      }
    />
  )
}
