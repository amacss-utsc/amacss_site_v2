"use client"

import { Event, EventTag } from "@/payload-types"
import { useStateContext } from "@/providers/State"
import { cn } from "@/utilities/cn"
import { addMonths, format, isSameMonth } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { FC, useEffect, useMemo, useState } from "react"
import {
  MONTH_PARAM_FORMAT,
  WEEKDAYS,
  dayFromKey,
  dayKey,
  formatEventTime,
  groupEventsByDay,
  monthGridDays,
  parseMonthParam,
  zonedDayKey,
} from "../utils"

type CalendarPageProps = {
  events: Event[]
  month: string
}

const MAX_CHIPS_PER_DAY = 3

const monthHref = (month: Date) =>
  `/calendar?m=${format(month, MONTH_PARAM_FORMAT)}`

const tagsOf = (event: Event): EventTag[] =>
  event.eventTag.filter((t): t is EventTag => typeof t !== "number")

export const CalendarPage: FC<CalendarPageProps> = ({ events, month }) => {
  const { setFocusedEvent } = useStateContext()

  const monthDate = useMemo(() => parseMonthParam(month), [month])
  const days = useMemo(() => monthGridDays(monthDate), [monthDate])
  const byDay = useMemo(() => groupEventsByDay(events), [events])

  // Resolved after mount so the server and the browser can't disagree on what
  // "today" is while hydrating.
  const [today, setToday] = useState<string | null>(null)

  useEffect(() => setToday(zonedDayKey(new Date())), [])

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [syncedMonth, setSyncedMonth] = useState(month)

  // Moving to another month drops a selection that no longer exists there.
  if (syncedMonth !== month) {
    setSyncedMonth(month)
    setSelectedKey(null)
  }

  const activeKey =
    selectedKey ??
    (today && isSameMonth(dayFromKey(today), monthDate)
      ? today
      : dayKey(monthDate))

  const activeDay = dayFromKey(activeKey)
  const activeEvents = byDay.get(activeKey) ?? []

  return (
    <main className="pt-16 px-4 lg:p-11 bg-gray-90 h-full lg:rounded-tl-[32px] overflow-x-hidden">
      <h1 className="hidden lg:block text-4xl font-bold mb-4 text-white">
        Calendar
      </h1>

      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-2xl lg:text-3xl font-bold text-white">
          {format(monthDate, "MMMM yyyy")}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={monthHref(addMonths(monthDate, -1))}
            scroll={false}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-50 text-gray-10 transition-colors hover:border-blue-30 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <Link
            href="/calendar"
            scroll={false}
            onClick={() => setSelectedKey(today)}
            className="rounded-full border border-gray-50 px-4 py-1.5 text-xs font-bold uppercase text-gray-10 transition-colors hover:border-blue-30 hover:text-white"
          >
            Today
          </Link>

          <Link
            href={monthHref(addMonths(monthDate, 1))}
            scroll={false}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-50 text-gray-10 transition-colors hover:border-blue-30 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 lg:items-start">
        <section>
          <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-1 lg:mb-2">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] lg:text-xs font-bold uppercase text-gray-20"
              >
                <span className="lg:hidden">{d.charAt(0)}</span>
                <span className="hidden lg:inline">{d}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 lg:gap-2">
            {days.map((day) => {
              const key = dayKey(day)
              const dayEvents = byDay.get(key) ?? []
              const outside = !isSameMonth(day, monthDate)
              const isToday = key === today
              const isActive = key === activeKey

              return (
                <div
                  key={key}
                  className={cn(
                    "group relative flex flex-col aspect-square lg:aspect-auto lg:min-h-[124px] rounded-lg lg:rounded-xl border p-1 lg:p-1.5 transition-colors",
                    outside
                      ? "border-gray-70 bg-gray-90"
                      : "border-gray-50 bg-gray-80",
                    isActive && "border-blue-30 bg-gray-70",
                  )}
                >
                  {/* The whole cell is the tap target at every breakpoint; the
                      chips below stack above this overlay so they keep opening
                      their own event rather than just selecting the day. */}
                  <button
                    onClick={() => setSelectedKey(key)}
                    aria-label={`${format(day, "EEEE, MMMM d, yyyy")}, ${
                      dayEvents.length
                    } event${dayEvents.length === 1 ? "" : "s"}`}
                    aria-pressed={isActive}
                    className="absolute inset-0 z-0 rounded-lg lg:rounded-xl"
                  />

                  <span
                    className={cn(
                      "pointer-events-none relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-full text-xs font-bold lg:self-start lg:text-sm",
                      outside ? "text-gray-30" : "text-gray-02",
                      isToday && "text-white lg:bg-blue-30",
                      !isToday && "lg:group-hover:bg-gray-60",
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Mobile: the cell is too small for titles, so events read as dots. */}
                  {dayEvents.length > 0 && (
                    <div className="pointer-events-none mt-auto mb-1 flex items-center justify-center gap-[3px] lg:hidden">
                      {dayEvents.slice(0, MAX_CHIPS_PER_DAY).map((ev, i) => (
                        <span
                          key={`${ev.id}-${i}`}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            outside ? "bg-gray-30" : "bg-blue-20",
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {/* Desktop: real chips that open the event straight away. */}
                  <div className="relative z-[1] mt-1 hidden flex-col gap-1 lg:flex">
                    {dayEvents.slice(0, MAX_CHIPS_PER_DAY).map((ev, i) => (
                      <button
                        key={`${ev.id}-${i}`}
                        onClick={() => setFocusedEvent(ev)}
                        title={ev.title}
                        className={cn(
                          "w-full truncate rounded-md border-l-2 border-blue-30 px-1.5 py-1 text-left text-[11px] font-semibold transition-colors",
                          outside
                            ? "bg-gray-80 text-gray-20 hover:bg-gray-70"
                            : "bg-gray-70 text-gray-02 hover:bg-gray-60",
                        )}
                      >
                        {ev.title}
                      </button>
                    ))}

                    {dayEvents.length > MAX_CHIPS_PER_DAY && (
                      <button
                        onClick={() => setSelectedKey(key)}
                        className="px-1.5 text-left text-[10px] font-bold uppercase text-gray-10 hover:text-white"
                      >
                        +{dayEvents.length - MAX_CHIPS_PER_DAY} more
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="mt-6 lg:mt-0 lg:rounded-2xl lg:border lg:border-gray-50 lg:bg-gray-80 lg:p-5">
          <h2 className="text-sm font-bold uppercase text-gray-10 mb-3">
            {format(activeDay, "EEEE, MMMM d")}
          </h2>

          {activeEvents.length === 0 ? (
            <p className="text-sm text-gray-20 pb-6">Nothing scheduled.</p>
          ) : (
            <ul className="flex flex-col gap-2 pb-6 lg:pb-0">
              {activeEvents.map((ev, i) => {
                const time = formatEventTime(ev)
                const tags = tagsOf(ev)

                return (
                  <li key={`${ev.id}-${i}`}>
                    <button
                      onClick={() => setFocusedEvent(ev)}
                      className="w-full rounded-xl border border-gray-50 bg-gray-80 p-3 text-left transition-colors hover:border-blue-30 hover:bg-gray-70 lg:bg-gray-90"
                    >
                      <p className="font-bold text-white">{ev.title}</p>

                      {time && (
                        <p className="mt-0.5 text-xs font-semibold text-blue-10">
                          {time}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-10 line-clamp-2">
                        {ev.previewText}
                      </p>

                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {tags.map((t) => (
                            <span
                              key={t.id}
                              className="rounded-md border border-gray-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-10"
                            >
                              {t.eventTag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </aside>
      </div>
    </main>
  )
}
