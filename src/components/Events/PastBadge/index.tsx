"use client"

import type { Event } from "@/payload-types"
import { cn } from "@/utilities/cn"
import { shouldShowPastBadge } from "@/utilities/pastEvent"
import { useEffect, useState } from "react"

export const PastEventBadge = ({
  event,
  compact = false,
}: {
  event: Pick<Event, "title" | "date" | "endDate">
  compact?: boolean
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
    <span
      className={cn(
        "pointer-events-none absolute z-[3] inline-flex items-center rounded-[5px] bg-[#4b5563] px-[9px] py-1 text-[10px] font-semibold uppercase leading-[15px] tracking-[0.04em] text-white",
        compact
          ? "right-2 top-2"
          : "right-3 top-3",
      )}
    >
      Past
    </span>
  )
}
