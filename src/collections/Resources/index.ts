import type { CollectionConfig } from "payload"
import { authenticated } from "../../access/authenticated"
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished"
import { revalidateResources } from "./hooks/revalidateResources"

export const Resources: CollectionConfig = {
  slug: "resources",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "resourceTags",
      type: "relationship",
      relationTo: "resource-tag",
      required: true,
      hasMany: true,
      admin: {
        isSortable: true,
      },
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "text",
      required: true,
      defaultValue: "Learn More",
    },
    {
      name: "link",
      type: "text",
      required: true,
      validate: (value) => {
        const urlRegex = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i
        if (!urlRegex.test(value)) {
          return "Please enter a valid URL format (e.g., https://example.com)"
        }
        return true
      },
    },
  ],
  hooks: {
    afterChange: [revalidateResources],
  },
}
