import type { CollectionConfig } from "payload"

import { anyone } from "../access/anyone"
import { authenticated } from "../access/authenticated"
import { contentInvalidationHooks } from "@/utilities/invalidateContent"
import { CONTENT_CACHE_TAGS } from "@/utilities/contentCacheTags"

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      //required: true,
    },
  ],
  upload: true,
  hooks: contentInvalidationHooks(
    [CONTENT_CACHE_TAGS.events],
    ["/", "/events", "/calendar"],
  ),
}
