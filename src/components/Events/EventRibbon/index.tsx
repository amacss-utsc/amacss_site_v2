"use client"

import type { Event } from "@/payload-types"
import { shouldShowPastBadge } from "@/utilities/pastEvent"
import { RibbonStyle } from "@/utilities/tailwindShared"
import { cn } from "@/utilities/cn"
import { useEffect, useState } from "react"

export const EventRibbon = ({
  event,
  compact = false,
}: {
  event: Pick<Event, "title" | "date" | "endDate" | "ribbonTag">
  compact?: boolean
}) => {
  // Match the server render, then evaluate the date in the browser.
  const [isPast, setIsPast] = useState(false)
  const { title, date, endDate, ribbonTag } = event

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

  const savedLabel = typeof ribbonTag === "object" ? ribbonTag?.ribbonTag : null
  // A rescheduled event must not show a stale PAST tag from cached data.
  const label = isPast
    ? "PAST"
    : savedLabel?.toUpperCase() === "PAST"
      ? null
      : savedLabel
  if (!label) return null

  return (
    <div
      className={cn(
        RibbonStyle,
        isPast ? "bg-gray-30" : "bg-blue-20",
        compact ? "top-[18px] h-[33px] left-[36px]" : "top-[19px] h-[35px] left-[38px]",
      )}
    >
      {label}
    </div>
  )
}
