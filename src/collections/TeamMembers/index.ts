import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['nameWithYear', 'role'],
    useAsTitle: 'nameWithYear',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'membership-year',
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
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: false,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name && data['membership-year']) {
          data.nameWithYear = `${data.name} (${data['membership-year']})`
        }
        return data
      },
    ],
  },
}
