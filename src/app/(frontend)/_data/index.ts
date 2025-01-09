import { Team, Event } from "@/payload-types"
import config from "@payload-config"
import { getPayload, PaginatedDocs } from "payload"

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

  teams.docs.sort((a, b) => {
    const yearA = typeof a.year === "number" ? a.year : 0
    const yearB = typeof b.year === "number" ? b.year : 0
    return yearB - yearA
  })

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

export const ErrDefault = (
  e: DataError | null,
  data: any,
  fallback: any,
): any => (e == null ? (data ?? fallback) : fallback)
