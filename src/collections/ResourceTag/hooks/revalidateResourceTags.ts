import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { Team } from "@/payload-types"

export const revalidateResourceTags: CollectionAfterChangeHook<Team> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidatePath("/resources")

  return doc
}
