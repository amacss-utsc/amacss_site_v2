import type { CollectionConfig } from "payload"

import { authenticated } from "../../access/authenticated"
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished"
import { contentInvalidationHooks } from "@/utilities/invalidateContent"
import { CONTENT_CACHE_TAGS } from "@/utilities/contentCacheTags"

export const RibbonTag: CollectionConfig = {
  slug: "ribbon-tag",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: "ribbonTag",
  },
  fields: [
    {
      name: "ribbonTag",
      type: "text",
      required: true,
    },
  ],
  hooks: contentInvalidationHooks(
    [CONTENT_CACHE_TAGS.events],
    ["/", "/events", "/calendar"],
  ),
}
