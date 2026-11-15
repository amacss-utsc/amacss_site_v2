import { LeaderboardPage } from "@/components/Leaderboard/Page"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { parseCheckInQuery } from "@/utilities/eventCheckInLink"

export const metadata: Metadata = {
  title: "Events Leaderboard",
  referrer: "no-referrer",
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
    revalidate: 60 * 60 * 24,
    tags: ["leaderboard"],
  },
)

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ checkin?: string | string[]; t?: string | string[] }>
}) {
  const { requested: requestedCheckIn, link: checkIn } = parseCheckInQuery(
    await searchParams,
  )
  let attendees: MemberProfile[] = []
  let currentMember: (MemberProfile & { rank: number }) | null = null
  let memberId: string | null = null

  try {
    const auth = await createSupabaseServerClient()
    const {
      data: { user },
    } = await auth.auth.getUser()
    memberId = user?.id ?? null
  } catch (error) {
    console.error("Leaderboard session unavailable:", error)
  }

  try {
    const admin = createSupabaseAdminClient()
    attendees = await getLeaderboard()

    if (memberId) {
      const { data: profile, error: profileError } = await admin
        .from("member_profiles")
        .select("id, full_name, points")
        .eq("id", memberId)
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
      checkIn={checkIn}
      invalidCheckInLink={requestedCheckIn && !checkIn}
      memberId={memberId}
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
