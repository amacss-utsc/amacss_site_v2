import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { Team } from "@/payload-types"

export const revalidateTeams: CollectionAfterChangeHook<Team> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidatePath("/team")

  return doc
}
