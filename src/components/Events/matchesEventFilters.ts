import { Event } from "@/payload-types"

type EventFilters = {
  tags: string[]
  tagsIndices: number[]
  startDate?: Date
  endDate?: Date
}

/** Shared by the events grid and the calendar so both honour the same filters. */
export const matchesEventFilters = (
  event: Event,
  { tags, tagsIndices, startDate, endDate }: EventFilters,
): boolean => {
  const eventDate = new Date(event.date)
  const dF =
    (!startDate && !endDate) ||
    (startDate && !endDate && eventDate >= startDate) ||
    (!startDate && endDate && eventDate <= endDate) ||
    (startDate && endDate && eventDate >= startDate && eventDate <= endDate)

  const eT = event.eventTag.map((tag) =>
    typeof tag !== "number" ? tag.eventTag : null,
  )

  const tF =
    tagsIndices.length === 0 ||
    tagsIndices.some((index) => tags[index] && eT.includes(tags[index]))

  return Boolean(dF && tF)
}
