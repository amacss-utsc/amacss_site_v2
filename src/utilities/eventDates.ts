import type { Event } from "@/payload-types"
import type { Where } from "payload"
import { CLUB_TIME_ZONE, zonedDayKey } from "@/components/Calendar/utils"

type EventDates = Pick<Event, "date" | "endDate">

// Free-text start/end times cannot reliably define an exact ending instant.
// An event remains current through its last calendar day in Toronto.
export function hasEventEnded(event: EventDates, now = new Date()): boolean {
  const start = new Date(event.date)
  if (Number.isNaN(start.getTime())) return false
  const end = event.endDate ? new Date(event.endDate) : start
  const last = !Number.isNaN(end.getTime()) && end > start ? end : start
  return zonedDayKey(last) < zonedDayKey(now)
}

const offsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CLUB_TIME_ZONE,
  timeZoneName: "longOffset",
})

export function startOfTorontoDay(now = new Date()): Date {
  const [year, month, day] = zonedDayKey(now).split("-").map(Number)
  const utcMidnight = Date.UTC(year, month - 1, day)
  let midnight = utcMidnight
  // Resolve the offset at midnight itself, including days when DST changes
  // later in the morning. A fixed UTC offset or the offset at noon is wrong.
  for (let pass = 0; pass < 2; pass++) {
    const zone = offsetFormatter
      .formatToParts(new Date(midnight))
      .find((part) => part.type === "timeZoneName")?.value
    const offset = /^GMT([+-])(\d{2}):(\d{2})$/.exec(zone ?? "")
    if (!offset) throw new Error("Unable to resolve Toronto timezone offset")
    const minutes =
      (Number(offset[2]) * 60 + Number(offset[3])) *
      (offset[1] === "+" ? 1 : -1)
    midnight = utcMidnight - minutes * 60_000
  }
  return new Date(midnight)
}

export function pastPinnedEventsWhere(now = new Date()): Where {
  const cutoff = startOfTorontoDay(now).toISOString()
  return {
    and: [
      { "ribbonTag.ribbonTag": { equals: "PINNED" } },
      { date: { less_than: cutoff } },
      {
        or: [
          { endDate: { exists: false } },
          { endDate: { less_than: cutoff } },
        ],
      },
    ],
  }
}
