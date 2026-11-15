import { randomBytes } from "node:crypto"

type CheckInFields = {
  attendanceCode?: string | null
  checkInOpensAt?: string | null
  checkInClosesAt?: string | null
}

export function prepareEventCheckInFields(
  incoming: CheckInFields,
  previous?: CheckInFields,
): Pick<CheckInFields, "attendanceCode"> {
  const opensAt =
    incoming.checkInOpensAt === undefined
      ? previous?.checkInOpensAt
      : incoming.checkInOpensAt
  const closesAt =
    incoming.checkInClosesAt === undefined
      ? previous?.checkInClosesAt
      : incoming.checkInClosesAt

  if (Boolean(opensAt) !== Boolean(closesAt)) {
    throw new Error(
      "Set both check-in opening and closing times, or leave both empty.",
    )
  }

  if (opensAt && closesAt) {
    const opens = new Date(opensAt).getTime()
    const closes = new Date(closesAt).getTime()
    if (
      !Number.isFinite(opens) ||
      !Number.isFinite(closes) ||
      opens >= closes
    ) {
      throw new Error("Check-in must close after it opens.")
    }

    return {
      attendanceCode:
        previous?.attendanceCode || randomBytes(24).toString("base64url"),
    }
  }

  // Keep an existing code when staff temporarily remove a window. Reopening
  // that event should not silently rotate a QR code already displayed.
  return { attendanceCode: previous?.attendanceCode ?? null }
}
