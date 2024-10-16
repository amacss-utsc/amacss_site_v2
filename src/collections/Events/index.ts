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
      name: 'endDate',
      type: 'date',
      required: false,
    },
    {
      name: 'startTime',
      type: 'text',
      required: false,
    },
    {
      name: 'endTime',
      type: 'text',
      required: false,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'registrationLink',
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
      name: 'eventTag',
      type: 'relationship',
      relationTo: 'event-tag',
      required: true,
      hasMany: true,
    },
    {
      name: 'ribbonTag',
      type: 'relationship',
      relationTo: 'ribbon-tag',
      required: false,
    },
  ],
}
