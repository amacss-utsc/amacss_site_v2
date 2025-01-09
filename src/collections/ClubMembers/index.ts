import { CollectionConfig } from "payload"

export const ClubMember: CollectionConfig = {
  slug: "club-member",
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      sameSite: "None",
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
    admin: () => false,
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      saveToJWT: true,
      options: [
        {
          label: "Club Member",
          value: "club-member",
        },
      ],
    },
  ],
}
