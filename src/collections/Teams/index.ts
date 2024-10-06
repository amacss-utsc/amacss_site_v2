import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Teams: CollectionConfig = {
  slug: 'teams',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['nameWithYear'],
    useAsTitle: 'nameWithYear',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
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
      name: 'sub-teams',
      type: 'relationship',
      hasMany: true,
      relationTo: 'sub-teams',
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
