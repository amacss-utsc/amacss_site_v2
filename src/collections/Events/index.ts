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
      name: "registrationLink",
      type: "text",
      required: false,
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
  ],
  hooks: {
    afterChange: [revalidateEvents],
  },
}
