import type { CollectionConfig } from 'payload'

export const dashboardItems: CollectionConfig = {
  slug: 'dashboardItem',
  labels: {
    singular: 'Dashboard Item',
    plural: 'Dashboard Items',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
