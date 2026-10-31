import { hasEventEnded } from "@/utilities/eventDates"
import type { Event } from "@/payload-types"

export const shouldShowPastBadge = (
  event: Pick<Event, "title" | "date" | "endDate">,
  now: Date = new Date(),
): boolean => {
  if (event.title.trim().toLowerCase() === "fy orientation") return false

  return hasEventEnded(event, now)
}
