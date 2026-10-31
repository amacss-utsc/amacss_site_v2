import { Event, Resource } from "@/payload-types"
import config from "@payload-config"
import { getPayload, PaginatedDocs } from "payload"
import { hasEventEnded } from "@/utilities/eventDates"
import {
  getPublicEvent,
  getPublicEvents,
  getPublicEventTags,
  getPublicResources,
  getPublicResourceTags,
} from "@/utilities/publicContent"

const DEV_CONTENT_ORIGIN = "https://www.amacss.org"

async function fetchDevContent<T>(path: string): Promise<T | null> {
  if (process.env.NODE_ENV !== "development") return null
  try {
    const response = await fetch(`${DEV_CONTENT_ORIGIN}${path}`, {
      cache: "no-store",
    })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

async function fetchDevEvents(limit: number, page: number, onSidebar = false) {
  const query = new URLSearchParams({
    limit: String(limit),
    page: String(Math.max(1, page)),
    depth: "1",
  })
  if (onSidebar) query.set("where[onSidebar][equals]", "true")
  const events = await fetchDevContent<PaginatedDocs<Event>>(
    `/api/events?${query}`,
  )
  if (!events?.docs?.length) return null
  return { ...events, docs: events.docs.map(withDevImageUrl).map(removePin) }
}

function withDevImageUrl(event: Event): Event {
  return {
    ...event,
    image:
      typeof event.image !== "number" && event.image?.url?.startsWith("/")
        ? {
            ...event.image,
            url: new URL(event.image.url, DEV_CONTENT_ORIGIN).toString(),
          }
        : event.image,
  }
}

type DataError = { code: number; message: string } | null
type FetchEventTagsType = { tags: string[] | null; error: DataError }
type FetchEventsType = { events: PaginatedDocs<Event> | null; error: DataError }
interface FetchEventsArgs {
  limit?: number
  page?: number
}
type FetchEventsInRangeType = { events: Event[] | null; error: DataError }
interface FetchEventsInRangeArgs {
  start: Date
  end: Date
  limit?: number
}
type FetchEventByIdType = { event: Event | null; error: DataError }
type FetchResourceTagsType = { tags: string[] | null; error: DataError }
type FetchResourcesType = {
  resources: PaginatedDocs<Resource> | null
  error: DataError
}
interface FetchResourcesArgs {
  limit?: number
  page?: number
  tags?: string[]
}

export const FetchEventTags = async (): Promise<FetchEventTagsType> => {
  if (process.env.NODE_ENV === "development") {
    const preview = await fetchDevContent<PaginatedDocs<{ eventTag: string }>>(
      "/api/event-tag?limit=100",
    )
    return {
      tags: preview?.docs?.map((tag) => tag.eventTag) ?? [],
      error: null,
    }
  }
  try {
    return { tags: await getPublicEventTags(), error: null }
  } catch (error) {
    console.error("FetchEventTags error:", error)
    return {
      tags: null,
      error: { code: 500, message: "Failed to fetch event tags" },
    }
  }
}

export const FetchEvents = async ({
  limit = 10,
  page = 0,
}: FetchEventsArgs = {}): Promise<FetchEventsType> => {
  if (process.env.NODE_ENV === "development") {
    return { events: await fetchDevEvents(limit, page), error: null }
  }
  try {
    const events = await getPublicEvents({ limit, page })
    // Derive time-sensitive badges after reading the cache so pins can expire
    // immediately without waiting for the daily database cleanup.
    return {
      events: { ...events, docs: events.docs.map(removePin) },
      error: null,
    }
  } catch (error) {
    console.error("FetchEvents error:", error)
    return {
      events: null,
      error: { code: 500, message: "Failed to fetch events" },
    }
  }
}

export const FetchEventsInRange = async ({
  start,
  end,
  limit = 200,
}: FetchEventsInRangeArgs): Promise<FetchEventsInRangeType> => {
  try {
    const events = await getPublicEvents({
      limit,
      sort: "date",
      where: {
        and: [
          { date: { less_than_equal: end.toISOString() } },
          {
            or: [
              { endDate: { greater_than_equal: start.toISOString() } },
              { date: { greater_than_equal: start.toISOString() } },
            ],
          },
        ],
      },
    })
    return { events: events.docs.map(removePin), error: null }
  } catch (error) {
    console.error("FetchEventsInRange error:", error)
    return {
      events: null,
      error: {
        code: 500,
        message: "Failed to fetch events for the requested range",
      },
    }
  }
}

export const FetchSidebarEvents = async ({
  limit = 100,
  page = 0,
}: FetchEventsArgs = {}): Promise<FetchEventsType> => {
  if (process.env.NODE_ENV === "development") {
    return { events: await fetchDevEvents(limit, page, true), error: null }
  }
  try {
    const events = await getPublicEvents({
      limit,
      page,
      where: { onSidebar: { equals: true } },
    })
    return {
      events: { ...events, docs: events.docs.map(removePin) },
      error: null,
    }
  } catch (error) {
    console.error("FetchSidebarEvents error:", error)
    return {
      events: null,
      error: { code: 500, message: "Failed to fetch sidebar events" },
    }
  }
}

const EVENT_NOT_FOUND: FetchEventByIdType = {
  event: null,
  error: { code: 404, message: "Event Not Found" },
}

export const FetchEventById = async (
  id: string,
): Promise<FetchEventByIdType> => {
  if (!/^\d+$/.test(id)) return EVENT_NOT_FOUND
  if (process.env.NODE_ENV === "development") {
    const response = await fetch(
      `${DEV_CONTENT_ORIGIN}/api/events/${id}?depth=1`,
      { cache: "no-store" },
    ).catch(() => null)
    if (response?.ok)
      return {
        event: removePin(withDevImageUrl((await response.json()) as Event)),
        error: null,
      }
    if (response?.status === 404) return EVENT_NOT_FOUND
  }
  try {
    const event = await getPublicEvent(id)
    return event ? { event: removePin(event), error: null } : EVENT_NOT_FOUND
  } catch (error) {
    console.error("FetchEventById error:", error)
    return {
      event: null,
      error: { code: 500, message: "Failed to fetch event" },
    }
  }
}

export const FetchResourceTags = async (): Promise<FetchResourceTagsType> => {
  try {
    return { tags: await getPublicResourceTags(), error: null }
  } catch (error) {
    console.error("FetchResourceTags error:", error)
    return {
      tags: null,
      error: { code: 500, message: "Failed to fetch resource tags" },
    }
  }
}

export const FetchResources = async ({
  limit = 10,
  page = 0,
  tags = [],
}: FetchResourcesArgs = {}): Promise<FetchResourcesType> => {
  try {
    return {
      resources: await getPublicResources(limit, page, tags),
      error: null,
    }
  } catch (error) {
    console.error("FetchResources error:", error)
    return {
      resources: null,
      error: { code: 500, message: "Failed to fetch resources" },
    }
  }
}

type SubmitRegistrationType = {
  success: boolean
  error?: DataError
}

export const SubmitRegistration = async (
  eventId: string | number,
  userId: string | number,
  answers: Array<{ fieldId: string; fieldType: string; answer: string | File }>,
): Promise<SubmitRegistrationType> => {
  const payload = await getPayload({ config })

  if (!payload) {
    return {
      success: false,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  try {
    const processedAnswers = await Promise.all(
      answers.map(async (answer) => {
        if (answer.fieldType === "image" && answer.answer instanceof File) {
          const formData = new FormData()
          formData.append("file", answer.answer)
          formData.append("alt", `Uploaded for ${answer.fieldId}`)

          const uploadResponse = await fetch(
            `${process.env.PAYLOAD_URL}/api/media`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${process.env.PAYLOAD_API_KEY}`,
              },
            },
          )

          if (!uploadResponse.ok) {
            throw new Error(`Image upload failed for field: ${answer.fieldId}`)
          }

          const uploadedFile = await uploadResponse.json()

          return {
            fieldId: answer.fieldId,
            fieldType: answer.fieldType,
            answer: uploadedFile.url,
          }
        }

        if (typeof answer.answer === "string") {
          return {
            fieldId: answer.fieldId,
            fieldType: answer.fieldType,
            answer: answer.answer,
          }
        }

        throw new Error(
          `Unsupported field type or invalid answer for field: ${answer.fieldId}`,
        )
      }),
    )

    await payload.create({
      collection: "registrations",
      data: {
        eventId: typeof eventId === "string" ? parseInt(eventId, 10) : eventId,
        userId: typeof userId === "string" ? parseInt(userId, 10) : userId,
        answers: processedAnswers,
        submittedAt: new Date().toISOString(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error("SubmitRegistration error:", error)
    return {
      success: false,
      error: {
        code: 500,
        message: `Failed to process registration: ${error.message}`,
      },
    }
  }
}

function removePin(event: Event) {
  const isPinned =
    typeof event.ribbonTag !== "number" &&
    event.ribbonTag?.ribbonTag?.toLowerCase() === "pinned"
  const isPast = hasEventEnded(event)

  if (isPinned && isPast) {
    return {
      ...event,
      ribbonTag: null,
    }
  }
  return event
}

export const ErrDefault = (
  e: DataError | null,
  data: any,
  fallback: any,
): any => (e == null ? (data ?? fallback) : fallback)
