import type { CollectionConfig } from "payload"

import { authenticated } from "../../access/authenticated"
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished"
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical"
import { contentInvalidationHooks } from "@/utilities/invalidateContent"
import { CONTENT_CACHE_TAGS } from "@/utilities/contentCacheTags"
import { prepareEventCheckInFields } from "@/utilities/eventCheckIn"
import { shouldShowPastBadge } from "@/utilities/pastEvent"

export const Events: CollectionConfig = {
  slug: "events",
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
      name: "points",
      label: "Points",
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      validate: (value) =>
        typeof value === "number" && Number.isInteger(value) && value >= 0
          ? true
          : "Points must be a nonnegative whole number.",
    },
    {
      name: "checkInOpensAt",
      label: "Check-in Opens At",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description:
          "Optional. Set both check-in times to enable event check-in.",
      },
    },
    {
      name: "checkInClosesAt",
      label: "Check-in Closes At",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "Check-in closes at this time.",
      },
    },
    {
      name: "attendanceCode",
      label: "Attendance Code",
      type: "text",
      access: {
        read: ({ req }) => req.user?.collection === "users",
      },
      admin: {
        readOnly: true,
        description:
          "Generated after saving both check-in times. Keep this code private.",
        components: {
          afterInput: ["@/components/admin/EventCheckInQR"],
        },
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
    },
    {
      name: "endDate",
      type: "date",
      required: false,
    },
    {
      name: "startTime",
      type: "text",
      required: false,
    },
    {
      name: "endTime",
      type: "text",
      required: false,
    },
    {
      name: "previewText",
      type: "textarea",
      required: true,
    },
    {
      name: "onSidebar",
      type: "checkbox",
      label: "Show in Sidebar",
      defaultValue: false,
    },
    {
      name: "description",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
            BlocksFeature({ blocks: [] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            UnorderedListFeature(),
            OrderedListFeature(),
          ]
        },
      }),
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "eventTag",
      type: "relationship",
      relationTo: "event-tag",
      required: true,
      hasMany: true,
    },
    {
      name: "ribbonTag",
      type: "relationship",
      relationTo: "ribbon-tag",
      required: false,
    },
    {
      name: "hasReferralCodes",
      label: "Use Referral Codes?",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "regStyle",
      label: "Type of Registration",
      type: "radio",
      options: [
        {
          label: "Internal Form",
          value: "internal",
        },
        {
          label: "External Link",
          value: "external",
        },
        {
          label: "No Registration Required",
          value: "none",
        },
      ],
    },
    {
      name: "registrationDeadline",
      label: "Registration Deadline",
      type: "date",
      required: false,
      admin: {
        condition: (data) =>
          data.regStyle == "internal" || data.regStyle == "external",
        date: { pickerAppearance: "dayAndTime" },
        description:
          "Optional. Leave empty to close registration at the end of the event's last day (Toronto time).",
      },
    },
    {
      name: "registrationLink",
      type: "text",
      required: false,
      admin: {
        condition: (data) => data.regStyle == "external",
      },
    },
    {
      name: "registrationForm",
      type: "array",
      label: "Registration Form Fields",
      admin: {
        condition: (data) => data.regStyle == "internal",
      },
      fields: [
        {
          name: "type",
          type: "select",
          label: "Field Type",
          options: [
            {
              label: "Small Text",
              value: "short_short",
            },
            {
              label: "1 Line Text",
              value: "short",
            },
            {
              label: "Multiline Text",
              value: "multiline",
            },
            {
              label: "Dropdown",
              value: "dropdown",
            },
            {
              label: "Image Upload",
              value: "image",
            },
            { label: "Referral Input", value: "referral" },
          ],
        },
        {
          name: "name",
          type: "text",
          label: "Display Name",
          required: true,
        },
        {
          name: "description",
          type: "text",
          label: "Description",
          required: false,
          admin: {
            description: "Add an optional description or hint for this field",
          },
        },
        {
          name: "requiredField",
          type: "checkbox",
          label: "Required?",
          defaultValue: true,
        },
        {
          name: "fieldid",
          type: "text",
          label: "Field ID",
          required: true,
          validate: (value) => {
            const snakeCaseRegex = /^[a-z0-9_]+$/
            if (!snakeCaseRegex.test(value)) {
              return "ID must be in snake_case, containing only lowercase letters, numbers, and underscores."
            }
            return true
          },
        },
        {
          name: "dropdownOptions",
          type: "array",
          label: "Dropdown Options",
          admin: {
            condition: (_, data) => data.type === "dropdown",
          },
          fields: [
            {
              name: "option",
              type: "text",
              label: "Option Text",
              required: true,
            },
          ],
        },
        {
          name: "placeholder",
          type: "text",
          label: "Placeholder",
          admin: {
            condition: (_, data) =>
              data.type !== "dropdown" && data.type !== "image",
          },
        },
      ],
    },
  ],
  hooks: {
    ...contentInvalidationHooks(
      [CONTENT_CACHE_TAGS.events],
      ["/", "/events", "/calendar", "/team", "/resources"],
    ),
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const changed =
          !originalDoc ||
          ("date" in data && data.date !== originalDoc.date) ||
          ("endDate" in data && data.endDate !== originalDoc.endDate) ||
          ("title" in data && data.title !== originalDoc.title) ||
          ("ribbonTag" in data && data.ribbonTag !== originalDoc.ribbonTag)
        if (!changed) return data

        const date = data.date ?? originalDoc?.date
        const title = data.title ?? originalDoc?.title
        if (!date || !title) return data
        const endDate = "endDate" in data ? data.endDate : originalDoc?.endDate
        const isPast = shouldShowPastBadge({ title, date, endDate })

        const pastTag = await req.payload.find({
          collection: "ribbon-tag",
          where: { ribbonTag: { equals: "PAST" } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const pastTagId = pastTag.docs[0]?.id
        if (!pastTagId) return data

        if (isPast) {
          data.ribbonTag = pastTagId
        } else {
          const currentTag = data.ribbonTag ?? originalDoc?.ribbonTag
          const currentTagId =
            typeof currentTag === "number" ? currentTag : currentTag?.id
          if (currentTagId === pastTagId) data.ribbonTag = null
        }
        return data
      },
    ],
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data
        Object.assign(data, prepareEventCheckInFields(data, originalDoc))
        return data
      },
    ],
  },
}
