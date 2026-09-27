import { NextResponse } from "next/server"
import { processEventNotificationJobs } from "@/utilities/notifications/event"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const result = await processEventNotificationJobs()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Notification dispatch failed", error)
    return NextResponse.json({ error: "Dispatch failed" }, { status: 500 })
  }
}
