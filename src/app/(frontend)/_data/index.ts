import { Team, Event, Resource } from "@/payload-types"
import config from "@payload-config"
import { getPayload, PaginatedDocs } from "payload"

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

async function fetchDevEvents(
  limit: number,
  page: number,
  onSidebar = false,
): Promise<PaginatedDocs<Event> | null> {
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

  return {
    ...events,
    docs: events.docs.map((event) => ({
      ...event,
      image:
        typeof event.image !== "number" && event.image?.url?.startsWith("/")
          ? {
              ...event.image,
              url: new URL(event.image.url, DEV_CONTENT_ORIGIN).toString(),
            }
          : event.image,
    })),
  }
}

type DataError = {
  code: number
  message: string
} | null

type FetchTeamType = {
  team: Team | null
  error: DataError
}

export const FetchTeam = async (): Promise<FetchTeamType> => {
  const payload = await getPayload({ config })

  if (!payload) {
    return {
      team: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  const teams = await payload.find({
    collection: "teams",
    where: {
      isCurrent: {
        equals: true,
      },
    },
    limit: 2,
    depth: 10,
  })

  if (!teams || !teams.docs || teams.docs.length === 0) {
    return {
      team: null,
      error: {
        code: 500,
        message: "Teams Query Failed or No Teams Found",
      },
    }
  }

  if (teams.docs.length > 1) {
    return {
      team: null,
      error: {
        code: 500,
        message: "Multiple Valid Teams Found",
      },
    }
  }

  const t = teams.docs[0]

  return {
    team: t,
    error: null,
  }
}

type FetchEventTagsType = {
  tags: string[] | null
  error: DataError
}

export const FetchEventTags = async (): Promise<FetchEventTagsType> => {
  if (process.env.NODE_ENV === "development") {
    const previewTags = await fetchDevContent<
      PaginatedDocs<{ eventTag: string }>
    >("/api/event-tag?limit=100")
    return {
      tags: previewTags?.docs?.map((tag) => tag.eventTag) ?? [],
      error: null,
    }
  }

  const payload = await getPayload({ config })

  if (!payload) {
    return {
      tags: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  const tags = await payload.find({
    collection: "event-tag",
  })

  if (!tags || !tags.docs || tags.docs.length === 0) {
    return {
      tags: null,
      error: {
        code: 500,
        message: "Tags Query Failed or No Tags Found",
      },
    }
  }

  const t = tags.docs.map((i) => i.eventTag)

  return {
    tags: t,
    error: null,
  }
}

type FetchEventsType = {
  events: PaginatedDocs<Event> | null
  error: DataError
}

interface FetchEventsArgs {
  limit?: number
  page?: number
}

export const FetchEvents = async ({
  limit = 10,
  page = 0,
}: FetchEventsArgs = {}): Promise<FetchEventsType> => {
  if (process.env.NODE_ENV === "development") {
    return { events: await fetchDevEvents(limit, page), error: null }
  }

  const payload = await getPayload({ config })

  if (!payload) {
    return {
      events: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  const events = await payload.find({
    collection: "events",
    page: page,
    limit: limit,
  })

  if (!events || !events.docs || events.docs.length === 0) {
    return {
      events: null,
      error: {
        code: 500,
        message: "Events Query Failed or No Events Found",
      },
    }
  }

  return {
    events: events,
    error: null,
  }
}

type FetchEventsInRangeType = {
  events: Event[] | null
  error: DataError
}

interface FetchEventsInRangeArgs {
  start: Date
  end: Date
  limit?: number
}

// Powers the calendar: everything overlapping the visible window
// An empty window is a normal result, not an error.
export const FetchEventsInRange = async ({
  start,
  end,
  limit = 200,
}: FetchEventsInRangeArgs): Promise<FetchEventsInRangeType> => {
  const payload = await getPayload({ config })

  if (!payload) {
    return {
      events: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  try {
    const events = await payload.find({
      collection: "events",
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

    return {
      events: events?.docs ?? [],
      error: null,
    }
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

type FetchSidebarEventsType = {
  events: PaginatedDocs<Event> | null
  error: DataError
}

export const FetchSidebarEvents = async ({
  limit = 100,
  page = 0,
}: FetchEventsArgs = {}): Promise<FetchSidebarEventsType> => {
  if (process.env.NODE_ENV === "development") {
    return { events: await fetchDevEvents(limit, page, true), error: null }
  }

  const payload = await getPayload({ config })

  if (!payload) {
    return {
      events: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  try {
    const events = await payload.find({
      collection: "events",
      page,
      limit,
      where: {
        onSidebar: {
          equals: true,
        },
      },
    })

    if (!events?.docs?.length) {
      return {
        events: null,
        error: {
          code: 404,
          message: "No sidebar events found",
        },
      }
    }

    return {
      events,
      error: null,
    }
  } catch (error) {
    console.error("FetchSidebarEvents error:", error)
    return {
      events: null,
      error: {
        code: 500,
        message: "Failed to fetch sidebar events",
      },
    }
  }
}

type FetchEventByIdType = {
  event: Event | null
  error: DataError
}

export const FetchEventById = async (
  id: string,
): Promise<FetchEventByIdType> => {
  const payload = await getPayload({ config })

  if (!payload) {
    return {
      event: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  const event = await payload.findByID({
    collection: "events",
    id,
  })

  if (!event) {
    return {
      event: null,
      error: {
        code: 404,
        message: "Event Not Found",
      },
    }
  }

  return {
    event,
    error: null,
  }
}

type FetchResourceTagsType = {
  tags: string[] | null
  error: DataError
}

export const FetchResourceTags = async (): Promise<FetchResourceTagsType> => {
  const payload = await getPayload({ config })

  if (!payload) {
    return {
      tags: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  const tags = await payload.find({
    collection: "resource-tag",
  })

  if (!tags || !tags.docs || tags.docs.length === 0) {
    return {
      tags: null,
      error: {
        code: 500,
        message: "Resource Tags Query Failed or No Tags Found",
      },
    }
  }

  const t = tags.docs.map((i) => i.resourceTag)

  return {
    tags: t,
    error: null,
  }
}

type FetchResourcesType = {
  resources: PaginatedDocs<Resource> | null
  error: DataError
}

interface FetchResourcesArgs {
  limit?: number
  page?: number
  tags?: string[]
}

export const FetchResources = async ({
  limit = 10,
  page = 0,
  tags = [],
}: FetchResourcesArgs = {}): Promise<FetchResourcesType> => {
  const payload = await getPayload({ config })

  if (!payload) {
    return {
      resources: null,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  try {
    const resources = await payload.find({
      collection: "resources",
      page,
      limit,
      depth: 2,
      where:
        tags.length > 0
          ? {
              resourceTags: {
                in: tags.map((tag) => ({ resourceTag: { equals: tag } })),
              },
            }
          : undefined,
    })

    if (!resources || !resources.docs || resources.docs.length === 0) {
      return {
        resources: null,
        error: {
          code: 404,
          message: "No Resources Found",
        },
      }
    }

    return {
      resources,
      error: null,
    }
  } catch (error) {
    console.error("FetchResources error:", error)
    return {
      resources: null,
      error: {
        code: 500,
        message: "Failed to fetch resources",
      },
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

export const ErrDefault = (
  e: DataError | null,
  data: any,
  fallback: any,
): any => (e == null ? (data ?? fallback) : fallback)
