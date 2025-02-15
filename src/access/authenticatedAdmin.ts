import type { AccessArgs } from "payload"
import type { User, ClubMember } from "@/payload-types"

type isAuthenticated = (args: AccessArgs<User | ClubMember>) => boolean

export const authenticatedAdmin: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user && user.collection === "users")
}
