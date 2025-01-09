import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { TeamMember } from "@/payload-types"

export const revalidateTeamMembers: CollectionAfterChangeHook<TeamMember> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidatePath("/team")

  return doc
}
