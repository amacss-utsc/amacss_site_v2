import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"

export const dynamic = "force-dynamic"

type ClaimResult = {
  status: string
  pointsAwarded?: number
  pointsBalance?: number
}

const failures: Record<string, { status: number; error: string }> = {
  invalid_request: { status: 400, error: "Invalid check-in request." },
  event_not_found: { status: 404, error: "Event not found." },
  account_not_found: { status: 401, error: "Sign in again." },
  profile_missing: { status: 403, error: "Complete your member profile." },
  email_unverified: { status: 403, error: "Verify your U of T email first." },
  checkin_closed: { status: 403, error: "Check-in is closed." },
  invalid_code: { status: 403, error: "Invalid check-in code." },
  points_unavailable: {
    status: 409,
    error: "Event points cannot be awarded. Ask event staff for help.",
  },
}

function respond(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params
  const eventNumber = Number(eventId)
  if (
    !/^[1-9]\d*$/.test(eventId) ||
    !Number.isSafeInteger(eventNumber) ||
    eventNumber > 2147483647
  ) {
    return respond({ error: "Invalid event." }, 400)
  }

  try {
    const auth = await createSupabaseServerClient()
    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser()
    if (authError || !user) {
      return respond({ error: "Sign in to check in." }, 401)
    }

    if (
      req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
      "application/json"
    ) {
      return respond({ error: "Expected a JSON request." }, 415)
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return respond({ error: "Invalid JSON request." }, 400)
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).length !== 1 ||
      !("attendanceCode" in body) ||
      typeof body.attendanceCode !== "string" ||
      !/^[A-Za-z0-9_-]{32}$/.test(body.attendanceCode)
    ) {
      return respond({ error: "Invalid check-in code." }, 400)
    }

    const admin = createSupabaseAdminClient()
    const { data, error } = await admin.rpc("claim_event_attendance", {
      p_event_id: eventNumber,
      p_member_id: user.id,
      p_attendance_code: body.attendanceCode,
    })
    if (error) throw error

    const result = data as ClaimResult | null
    if (
      !result ||
      typeof result !== "object" ||
      typeof result.status !== "string"
    ) {
      throw new Error("Invalid attendance claim response.")
    }

    if (result.status === "claimed") {
      if (
        !Number.isSafeInteger(result.pointsAwarded) ||
        !Number.isSafeInteger(result.pointsBalance) ||
        result.pointsAwarded! < 0 ||
        result.pointsBalance! < 0
      ) {
        throw new Error("Invalid attendance point values.")
      }
      try {
        revalidateTag("leaderboard")
      } catch (cacheError) {
        // The points are committed even if cache invalidation fails.
        console.error("Could not refresh leaderboard cache:", cacheError)
      }
      return respond({
        status: "claimed",
        pointsAwarded: result.pointsAwarded,
        pointsBalance: result.pointsBalance,
      })
    }

    if (result.status === "already_claimed") {
      return respond({ status: "already_claimed" })
    }

    if (!Object.prototype.hasOwnProperty.call(failures, result.status)) {
      throw new Error("Unknown attendance claim status.")
    }
    const failure = failures[result.status]
    return respond({ error: failure.error }, failure.status)
  } catch (error) {
    console.error("Event check-in failed:", error)
    return respond({ error: "Could not check in. Please try again." }, 500)
  }
}
