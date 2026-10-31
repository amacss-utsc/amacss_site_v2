import config from "@payload-config"
import { getPayload, type Where } from "payload"
import { cache } from "react"
import { unstable_cache } from "next/cache"
import { CONTENT_CACHE_SECONDS, CONTENT_CACHE_TAGS } from "./contentCacheTags"

const eventCacheOptions = {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: [CONTENT_CACHE_TAGS.events],
}

// Cache only public collection reads. Account and registration data never enter
// these caches. React cache also deduplicates identical reads within a render.
const queryEvents = cache(
  unstable_cache(
    async (limit: number, page: number, whereJson: string, sort: string) => {
      const payload = await getPayload({ config })
      return payload.find({
        collection: "events",
        limit,
        page,
        where: JSON.parse(whereJson) as Where,
        sort,
        depth: 1,
        draft: false,
        overrideAccess: false,
      })
    },
    ["public-events-v1"],
    eventCacheOptions,
  ),
)

export function getPublicEvents({
  limit,
  page = 1,
  where = {},
  sort = "-createdAt",
}: {
  limit: number
  page?: number
  where?: Where
  sort?: string
}) {
  return queryEvents(limit, Math.max(1, page), JSON.stringify(where), sort)
}

export const getPublicEvent = cache(
  unstable_cache(
    async (id: string) => {
      const payload = await getPayload({ config })
      try {
        return await payload.findByID({
          collection: "events",
          id,
          depth: 1,
          draft: false,
          overrideAccess: false,
        })
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          error.status === 404
        ) {
          return null
        }
        // Throw outages so Next.js keeps the previous successful cache entry.
        throw error
      }
    },
    ["public-event-v1"],
    eventCacheOptions,
  ),
)

export const getPublicEventTags = cache(
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: "event-tag",
        pagination: false,
        depth: 0,
        overrideAccess: false,
      })
      return result.docs.map((tag) => tag.eventTag)
    },
    ["public-event-tags-v1"],
    { revalidate: CONTENT_CACHE_SECONDS, tags: [CONTENT_CACHE_TAGS.eventTags] },
  ),
)

const queryResources = cache(
  unstable_cache(
    async (limit: number, page: number, tagsJson: string) => {
      const payload = await getPayload({ config })
      const tags = JSON.parse(tagsJson) as string[]
      return payload.find({
        collection: "resources",
        limit,
        page,
        depth: 2,
        overrideAccess: false,
        where:
          tags.length > 0
            ? { "resourceTags.resourceTag": { in: tags } }
            : undefined,
      })
    },
    ["public-resources-v1"],
    { revalidate: CONTENT_CACHE_SECONDS, tags: [CONTENT_CACHE_TAGS.resources] },
  ),
)

export function getPublicResources(
  limit: number,
  page: number,
  tags: string[],
) {
  return queryResources(
    limit,
    Math.max(1, page),
    JSON.stringify([...new Set(tags)].sort()),
  )
}

export const getPublicResourceTags = cache(
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: "resource-tag",
        pagination: false,
        depth: 0,
        overrideAccess: false,
      })
      return result.docs.map((tag) => tag.resourceTag)
    },
    ["public-resource-tags-v1"],
    {
      revalidate: CONTENT_CACHE_SECONDS,
      tags: [CONTENT_CACHE_TAGS.resourceTags],
    },
  ),
)
