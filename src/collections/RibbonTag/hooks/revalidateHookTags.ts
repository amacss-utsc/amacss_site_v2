import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { RibbonTag } from "@/payload-types"

export const revalidateRibbonTags: CollectionAfterChangeHook<RibbonTag> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidatePath("/events")
  revalidatePath("/")

  return doc
}
