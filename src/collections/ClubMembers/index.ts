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
    forgotPassword: {
      // @ts-ignore
      generateEmailHTML: ({ token, user }) => {
        const resetURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`

        return `
          <h1>Reset Your Password</h1>
          <p>Hello ${user.firstName || ""},</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetURL}">Reset Password</a>
        `
      },
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
