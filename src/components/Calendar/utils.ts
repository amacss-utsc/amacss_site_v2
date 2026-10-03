import { Event } from "@/payload-types"
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns"

export const MONTH_PARAM_FORMAT = "yyyy-MM"
const DAY_KEY_FORMAT = "yyyy-MM-dd"

// Events are stored as instants, but a calendar is about calendar days. Keying
// them off the viewer's locale would put an 8pm event on different days on the
// server (UTC) and in the browser, which hydrates as a mismatch - so every day
// key is resolved in the club's own timezone instead.
export const CLUB_TIME_ZONE = "America/Toronto"

// A single bad `endDate` shouldn't be able to paint every cell in the grid.
const MAX_EVENT_SPAN_DAYS = 60

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const zonedDayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: CLUB_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

/** Day key for an instant, resolved in the club's timezone. */
export const zonedDayKey = (d: Date): string => {
  const parts = zonedDayFormatter.formatToParts(d)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""

  return `${get("year")}-${get("month")}-${get("day")}`
}

/** Day key for a grid cell, which is already a local midnight. */
export const dayKey = (d: Date): string => format(d, DAY_KEY_FORMAT)

export const dayFromKey = (key: string): Date =>
  parse(key, DAY_KEY_FORMAT, new Date())

export const parseMonthParam = (m?: string | null): Date => {
  if (!m) return startOfMonth(new Date())

  const parsed = parse(m, MONTH_PARAM_FORMAT, new Date())

  return isValid(parsed) ? startOfMonth(parsed) : startOfMonth(new Date())
}

// The grid always renders whole weeks, so it spills past the month on both ends.
export const monthGridRange = (month: Date) => ({
  gridStart: startOfWeek(startOfMonth(month)),
  gridEnd: endOfWeek(endOfMonth(month)),
})

export const monthGridDays = (month: Date): Date[] => {
  const { gridStart, gridEnd } = monthGridRange(month)

  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

const compareEvents = (a: Event, b: Event) => {
  const d = new Date(a.date).getTime() - new Date(b.date).getTime()

  return d !== 0 ? d : a.title.localeCompare(b.title)
}

/** Multi-day events get an entry on every day they cover. */
export const groupEventsByDay = (events: Event[]): Map<string, Event[]> => {
  const map = new Map<string, Event[]>()

  for (const event of events) {
    const start = new Date(event.date)

    if (!isValid(start)) continue

    const rawEnd = event.endDate ? new Date(event.endDate) : start
    const end = isValid(rawEnd) && rawEnd > start ? rawEnd : start

    const days = eachDayOfInterval({
      start: dayFromKey(zonedDayKey(start)),
      end: dayFromKey(zonedDayKey(end)),
    }).slice(0, MAX_EVENT_SPAN_DAYS)

    for (const day of days) {
      const key = dayKey(day)
      const existing = map.get(key)

      if (existing) existing.push(event)
      else map.set(key, [event])
    }
  }

  for (const list of map.values()) list.sort(compareEvents)

  return map
}

// `startTime` / `endTime` are free text, and a date-only event sits at midnight,
// so fall back to showing nothing rather than a meaningless "12:00 AM".
export const formatEventTime = (event: Event): string | null => {
  const start = event.startTime?.trim()
  const end = event.endTime?.trim()

  if (start && end) return `${start} - ${end}`

  return start || end || null
}
