import { CalendarPage } from "@/components/Calendar/Page"
import {
  MONTH_PARAM_FORMAT,
  monthGridRange,
  parseMonthParam,
} from "@/components/Calendar/utils"
import { addDays, format } from "date-fns"
import React from "react"
import { ErrDefault, FetchEventsInRange } from "../_data"

type PageProps = {
  searchParams: Promise<{ m?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { m } = await searchParams

  const month = parseMonthParam(m)
  const { gridStart, gridEnd } = monthGridRange(month)

  // Padded a day either side so events sitting near the edge of the grid
  // survive the offset between the server's UTC clock and the club timezone.
  const { events, error } = await FetchEventsInRange({
    start: addDays(gridStart, -1),
    end: addDays(gridEnd, 1),
  })

  const e = ErrDefault(error, events, [])

  return <CalendarPage events={e} month={format(month, MONTH_PARAM_FORMAT)} />
}
