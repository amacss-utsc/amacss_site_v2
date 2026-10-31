import { revalidatePath, revalidateTag } from "next/cache"

export function contentInvalidationHooks(tags: string[], paths: string[]) {
  // Both Payload afterChange and afterDelete supply a doc. Using the same hooks
  // covers creates, edits, and deletes, including the daily unpin operation.
  const invalidate = ({ doc }: { doc: unknown }) => {
    tags.forEach((tag) => revalidateTag(tag))
    paths.forEach((path) => revalidatePath(path))
    return doc
  }

  return {
    afterChange: [invalidate],
    afterDelete: [invalidate],
  }
}
