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
    defaultColumns: ['name', 'role'],
    useAsTitle: 'name',
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
    ],
}
