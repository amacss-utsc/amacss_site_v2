import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const EventTag: CollectionConfig = {
  slug: 'event-tag',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'eventTag',
  },
  fields: [
    {
      name: 'eventTag',
      type: 'text',
      required: true,
    },
  ],
}
