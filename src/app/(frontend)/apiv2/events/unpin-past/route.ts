import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { pastEventsWithoutPastRibbonWhere } from "@/utilities/eventDates"

export const dynamic = "force-dynamic"

// Vercel invokes this once daily; page reads still derive the ribbon from dates.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const existingPastTag = await payload.find({
      collection: "ribbon-tag",
      where: { ribbonTag: { equals: "PAST" } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const pastTag =
      existingPastTag.docs[0] ??
      (await payload.create({
        collection: "ribbon-tag",
        data: { ribbonTag: "PAST" },
        overrideAccess: true,
      }))
    const result = await payload.update({
      collection: "events",
      where: pastEventsWithoutPastRibbonWhere(pastTag.id),
      data: { ribbonTag: pastTag.id },
      overrideAccess: true,
    })

    if (result.errors.length > 0) {
      throw new Error(`Failed to mark ${result.errors.length} events as past`)
    }

    return NextResponse.json({ markedPast: result.docs.length })
  } catch (error) {
    console.error("Daily past-event ribbon update failed:", error)
    return NextResponse.json(
      { error: "Past-event ribbon update failed" },
      { status: 500 },
    )
  }
}
