import type { CollectionAfterChangeHook } from "payload"
import { revalidatePath } from "next/cache"
import { Event } from "@/payload-types"

export const revalidateEvents: CollectionAfterChangeHook<Event> = ({
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
