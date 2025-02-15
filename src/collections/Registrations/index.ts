import { authenticatedAdmin } from "@/access/authenticatedAdmin"
import type { CollectionConfig } from "payload"
import { generate, charset, Charset } from "referral-codes"
import config from "@payload-config"
import { getPayload } from "payload"

function generateReferralCode() {
  const codes = generate({
    length: 8,
    count: 1,
    charset: "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ",
  })
  return codes[0]
}

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
      name: "referralCode",
      type: "text",
      label: "Referral Code",
      required: false,
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
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === "create" && data.eventId) {
          const payload = await getPayload({ config })

          const event = await payload.findByID({
            collection: "events",
            id: data.eventId,
          })

          if (event?.hasReferralCodes) {
            data.referralCode = generateReferralCode()
          }
        }
      },
    ],
  },
}
