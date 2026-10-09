"use client"

import type { Event } from "@/payload-types"
import { cn } from "@/utilities/cn"
import { shouldShowPastBadge } from "@/utilities/pastEvent"
import { RibbonStyle } from "@/utilities/tailwindShared"
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
        RibbonStyle,
        "pointer-events-none rotate-45 translate-x-1/2 bg-gray-30",
        compact
          ? "right-[36px] top-[18px] h-[33px]"
          : "right-[38px] top-[19px] h-[35px]",
      )}
    >
      Past
    </span>
  )
}
