import type { GlobalConfig } from 'payload'

export const dashboard: GlobalConfig = {
  slug: 'dashboard',
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'dashboardItem', // Relation to the DashboardItem collection
      hasMany: true, // Multiple items (events)
    },
  ],
}
