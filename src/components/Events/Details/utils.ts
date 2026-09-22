import type { Event, EventTag, Media } from "@/payload-types"

export type EventImageData = Media & {
  url: string
  width: number
  height: number
}

export const getEventImage = (event: Event): EventImageData | null => {
  const image = typeof event.image !== "number" ? event.image : null
  if (!image?.url || image.width == null || image.height == null) return null
  return image as EventImageData
}

export const getEventTags = (event: Event): EventTag[] =>
  event.eventTag.filter((tag): tag is EventTag => typeof tag !== "number")

export const getRegistrationHref = (event: Event): string | null => {
  if (event.regStyle === "internal") return `/register/event/${event.id}`
  if (event.regStyle === "external" && event.registrationLink)
    return event.registrationLink
  return null
}
