import type { CollectionConfig } from "payload"
import { authenticated } from "../../access/authenticated"
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished"
import { contentInvalidationHooks } from "@/utilities/invalidateContent"
import { CONTENT_CACHE_TAGS } from "@/utilities/contentCacheTags"

export const ResourceTag: CollectionConfig = {
  slug: "resource-tag",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: "resourceTag",
  },
  fields: [
    {
      name: "resourceTag",
      type: "text",
      required: true,
      unique: true,
    },
  ],
  hooks: contentInvalidationHooks(
    [CONTENT_CACHE_TAGS.resourceTags, CONTENT_CACHE_TAGS.resources],
    ["/resources"],
  ),
}
