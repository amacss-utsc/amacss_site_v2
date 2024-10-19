import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const RibbonTag: CollectionConfig = {
  slug: 'ribbon-tag',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'ribbonTag',
  },
  fields: [
    {
      name: 'ribbonTag',
      type: 'text',
      required: true,
    },
  ],
}
