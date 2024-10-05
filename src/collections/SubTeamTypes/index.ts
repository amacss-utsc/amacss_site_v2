import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const SubTeamTypes: CollectionConfig = {
    slug: 'sub-team-types',
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    admin: {
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
    fields: [
        {
        name: 'name',
        type: 'text',
        required: true,
        },
    ],
}
