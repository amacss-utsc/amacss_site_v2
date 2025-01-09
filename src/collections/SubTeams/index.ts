import type { CollectionConfig } from "payload"

import { authenticated } from "../../access/authenticated"
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished"
import { revalidateSubteams } from "./hooks/revalidateSubteams"

export const SubTeams: CollectionConfig = {
  slug: "sub-teams",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["nameWithYear"],
    useAsTitle: "nameWithYear",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "relationship",
      hasMany: false,
      relationTo: "sub-team-types",
      required: true,
    },
    {
      name: "year",
      type: "text",
      required: true,
    },
    {
      name: "nameWithYear",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "prio-team-members",
      label: "High Ranking/Priority Team Members",
      type: "array",
      fields: [
        {
          name: "member",
          type: "relationship",
          relationTo: "team-members",
        },
      ],
    },
    {
      name: "team-members",
      type: "array",
      fields: [
        {
          name: "member",
          type: "relationship",
          relationTo: "team-members",
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name && data["year"]) {
          data.nameWithYear = `${data.name} (${data["year"]})`
        }
        return data
      },
    ],
    afterChange: [revalidateSubteams],
  },
}
