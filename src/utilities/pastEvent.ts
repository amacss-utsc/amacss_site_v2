import { zonedDayKey } from "@/components/Calendar/utils"
import type { Event } from "@/payload-types"

export const shouldShowPastBadge = (
  event: Pick<Event, "title" | "date" | "endDate">,
  now: Date = new Date(),
): boolean => {
  if (event.title.trim().toLowerCase() === "fy orientation") return false

  const end = event.endDate ? new Date(event.endDate) : null
  const lastDay = end && !Number.isNaN(end.getTime()) ? end : new Date(event.date)

  if (Number.isNaN(lastDay.getTime())) return false

  return zonedDayKey(lastDay) < zonedDayKey(now)
}
