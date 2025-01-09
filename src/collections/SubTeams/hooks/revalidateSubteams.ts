import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { SubTeam } from "@/payload-types"

export const revalidateSubteams: CollectionAfterChangeHook<SubTeam> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidatePath("/team")

  return doc
}
