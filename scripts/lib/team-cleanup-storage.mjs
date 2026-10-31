// Storage removal is idempotent: a retry may include an already absent object.
// Persist successful batches independently of the deleted database records.
export async function finishStorageCleanup({
  storage,
  files,
  completedFiles = [],
  saveProgress,
  beforeDelete = async () => {},
}) {
  const completed = new Set(completedFiles)
  const pending = [...new Set(files)].filter((file) => !completed.has(file))
  for (let offset = 0; offset < pending.length; offset += 50) {
    const batch = pending.slice(offset, offset + 50)
    await beforeDelete(batch)
    const { error } = await storage.remove(batch)
    if (error) throw new Error(`Delete photo files: ${error.message}`)
    batch.forEach((file) => completed.add(file))
    await saveProgress([...completed])
  }
  return [...completed]
}
