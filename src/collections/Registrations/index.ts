import { authenticatedAdmin } from "@/access/authenticatedAdmin"
import type { CollectionConfig } from "payload"

export const Registrations: CollectionConfig = {
  slug: "registrations",
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: authenticatedAdmin,
    delete: authenticatedAdmin,
  },
  admin: {
    useAsTitle: "id",
  },
  fields: [
    {
      name: "eventId",
      type: "relationship",
      relationTo: "events",
      required: true,
    },
    {
      name: "userId",
      type: "relationship",
      relationTo: "club-member", // Link to the club members collection
      required: true,
    },
    {
      name: "answers",
      type: "array",
      label: "Form Answers",
      fields: [
        {
          name: "fieldId",
          type: "text",
          label: "Field ID",
          required: true,
        },
        {
          name: "fieldType",
          type: "text",
          label: "Field Type",
          required: true,
        },
        {
          name: "answer",
          type: "text",
          label: "Answer",
          required: true,
        },
      ],
    },
    {
      name: "images",
      type: "relationship",
      relationTo: "media",
      hasMany: true, // Allow multiple image uploads
      required: false,
    },
    {
      name: "submittedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
