import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { EventTag } from "@/payload-types"

export const revalidateEventTags: CollectionAfterChangeHook<EventTag> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidatePath("/events")
  revalidatePath("/")

  return doc
}
