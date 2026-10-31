import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { pastPinnedEventsWhere } from "@/utilities/eventDates"

export const dynamic = "force-dynamic"

// Vercel invokes this once daily; ordinary page reads never perform cleanup.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const result = await payload.update({
      collection: "events",
      where: pastPinnedEventsWhere(),
      data: { ribbonTag: null },
      overrideAccess: true,
    })

    if (result.errors.length > 0) {
      throw new Error(`Failed to unpin ${result.errors.length} events`)
    }

    return NextResponse.json({ unpinned: result.docs.length })
  } catch (error) {
    console.error("Daily event unpin failed:", error)
    return NextResponse.json({ error: "Event unpin failed" }, { status: 500 })
  }
}
