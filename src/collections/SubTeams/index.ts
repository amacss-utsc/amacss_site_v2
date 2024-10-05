import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const SubTeams: CollectionConfig = {
  slug: 'sub-teams',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['nameWithYear'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'relationship',
      hasMany: false,
      relationTo: 'sub-team-types',
      required: true,
    },
    {
      name: 'year',
      type: 'text',
      required: true,
    },
    {
      name: 'nameWithYear',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'team-members',
      type: 'relationship',
      hasMany: true,
      relationTo: 'team-members',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name && data['year']) {
          data.nameWithYear = `${data.name} (${data['year']})`
        }
        return data
      },
    ],
  },
}
