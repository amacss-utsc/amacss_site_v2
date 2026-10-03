import { zonedDayKey } from "@/components/Calendar/utils"
import type { Event } from "@/payload-types"

// An explicit deadline wins. Otherwise registration stays open through the
// event's last day in the club's timezone - startTime/endTime are free text,
// so end of day is the latest cutoff that can be computed reliably.
export const isRegistrationOpen = (
  event: Pick<Event, "date" | "endDate" | "registrationDeadline">,
  now: Date = new Date(),
): boolean => {
  if (event.registrationDeadline) {
    const deadline = new Date(event.registrationDeadline)

    if (!Number.isNaN(deadline.getTime())) return now < deadline
  }

  const lastDay = new Date(event.endDate ?? event.date)

  if (Number.isNaN(lastDay.getTime())) return false

  return zonedDayKey(now) <= zonedDayKey(lastDay)
}
