import type { CollectionConfig } from "payload"
import { authenticated } from "../../access/authenticated"
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished"
import { revalidateResourceTags } from "./hooks/revalidateResourceTags"

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
  hooks: {
    afterChange: [revalidateResourceTags],
  },
}
