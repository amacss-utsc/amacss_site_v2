import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'end date',
      type: 'date',
      required: false,
    },
    {
      name: 'start time',
      type: 'text',
      required: false,
    },
    {
      name: 'end time',
      type: 'text',
      required: false,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'registration link',
      type: 'text',
      required: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'tags',
      type: 'text',
      required: true,
    },
    {
      name: 'ribbon tag',
      type: 'relationship',
      relationTo: 'event-tag',
      required: false,
    },
  ],
}
