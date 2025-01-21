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
import { revalidateEvents } from "./hooks/revalidateEvents"

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
          ],
        },
        {
          name: "name",
          type: "text",
          label: "Display Name",
          required: true,
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
    afterChange: [revalidateEvents],
  },
}
