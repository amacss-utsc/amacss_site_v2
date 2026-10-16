import { LeaderboardPage } from "@/components/Leaderboard/Page"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import type { Metadata } from "next"
import { unstable_cache } from "next/cache"

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

const getLeaderboard = unstable_cache(
  async () => {
    const admin = createSupabaseAdminClient()
    const { data, error } = await admin
      .from("member_profiles")
      .select("id, full_name, points")
      .gt("points", 0)
      .order("points", { ascending: false })
      .order("full_name", { ascending: true })

    if (error) throw error
    return (data ?? []) as MemberProfile[]
  },
  ["leaderboard"],
  {
    revalidate: 60 * 60 * 12,
    tags: ["leaderboard"],
  },
)

export default async function Page() {
  let attendees: MemberProfile[] = []
  let currentMember: (MemberProfile & { rank: number }) | null = null

  try {
    const admin = createSupabaseAdminClient()
    attendees = await getLeaderboard()

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
      attendees={attendees.map((profile) => ({
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
