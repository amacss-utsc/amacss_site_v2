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
    defaultColumns: ['name'],
    useAsTitle: 'name',
    },
    fields: [
        {
        name: 'name',
        type: 'text',
        required: true,
        },
        {
            name: 'sub-teams',
            type: 'relationship',
            hasMany: true,
            relationTo: 'sub-teams',
        },
    ],
}