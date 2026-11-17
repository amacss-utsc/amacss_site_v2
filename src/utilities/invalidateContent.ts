import { revalidatePath, revalidateTag } from "next/cache"

export function contentInvalidationHooks(tags: string[], paths: string[]) {
  // Both Payload afterChange and afterDelete supply a doc. Using the same hooks
  // covers creates, edits, deletes, and the daily past-ribbon update.
  const invalidate = ({ doc }: { doc: unknown }) => {
    tags.forEach((tag) => revalidateTag(tag, { expire: 0 }))
    paths.forEach((path) => revalidatePath(path))
    return doc
  }

  return {
    afterChange: [invalidate],
    afterDelete: [invalidate],
  }
}
