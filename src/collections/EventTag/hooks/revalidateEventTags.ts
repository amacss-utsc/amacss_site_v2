import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { EventTag } from "@/payload-types"

export const revalidateEventTags: CollectionAfterChangeHook<EventTag> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/team")
  revalidatePath("/resources")

  return doc
}
