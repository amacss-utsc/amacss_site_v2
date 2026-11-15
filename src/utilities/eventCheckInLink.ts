export type CheckInLink = { eventId: number; code: string }

export function isAttendanceCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{32}$/.test(value)
}

export function parseCheckInQuery({
  checkin,
  t,
}: {
  checkin?: string | string[]
  t?: string | string[]
}): { requested: boolean; link: CheckInLink | null } {
  const requested = checkin !== undefined || t !== undefined
  if (
    typeof checkin !== "string" ||
    !/^[1-9]\d*$/.test(checkin) ||
    !isAttendanceCode(t)
  ) {
    return { requested, link: null }
  }

  const eventId = Number(checkin)
  if (!Number.isSafeInteger(eventId) || eventId > 2147483647) {
    return { requested, link: null }
  }

  return { requested, link: { eventId, code: t } }
}

export function buildCheckInPath({ eventId, code }: CheckInLink) {
  if (
    !Number.isSafeInteger(eventId) ||
    eventId < 1 ||
    eventId > 2147483647 ||
    !isAttendanceCode(code)
  ) {
    throw new Error("Invalid event check-in link.")
  }
  return `/leaderboard?checkin=${eventId}&t=${encodeURIComponent(code)}`
}
