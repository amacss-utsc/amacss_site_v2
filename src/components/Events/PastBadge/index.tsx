"use client"

import type { Event } from "@/payload-types"
import { shouldShowPastBadge } from "@/utilities/pastEvent"
import { useEffect, useState } from "react"

export const PastEventBadge = ({
  event,
}: {
  event: Pick<Event, "title" | "date" | "endDate">
}) => {
  // Start without a badge so server and client render the same initial markup.
  const [isPast, setIsPast] = useState(false)
  const { title, date, endDate } = event

  useEffect(() => {
    const update = () => setIsPast(shouldShowPastBadge({ title, date, endDate }))
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") update()
    }

    update()
    const interval = window.setInterval(update, 60_000)
    window.addEventListener("focus", update)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener("focus", update)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [title, date, endDate])

  if (!isPast) return null

  return (
    <span className="pointer-events-none absolute right-2 top-2 z-[4] rounded-lg border-2 border-white bg-amber-300 px-3 py-1.5 text-sm font-black uppercase tracking-wider text-gray-90 shadow-[0_3px_12px_rgba(0,0,0,0.5)]">
      Past
    </span>
  )
}
