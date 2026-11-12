// Bound the streamed body too: Content-Length is optional and untrusted.
export async function readUploadForm(
  request: Request,
  maxBytes = 4 * 1024 * 1024,
) {
  if (
    !request.headers.get("content-type")?.startsWith("multipart/form-data;")
  ) {
    throw new Error("Expected multipart/form-data.")
  }
  const reader = request.body?.getReader()
  if (!reader) throw new Error("Missing request body.")
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes)
        throw new Error("Upload exceeds the 4 MB request limit.")
      chunks.push(value)
    }
  } catch (error) {
    await reader.cancel()
    throw error
  } finally {
    reader.releaseLock()
  }
  return new Response(new Blob(chunks as BlobPart[]), {
    headers: { "content-type": request.headers.get("content-type")! },
  }).formData()
}

export function safeUploadName(name: string) {
  return (
    /^[a-zA-Z0-9][a-zA-Z0-9_. -]{0,119}$/.test(name) && !name.includes("..")
  )
}

export function validSeminarPath(
  department: string,
  course: string,
  year: string,
  semester: string,
) {
  return (
    /^[a-z]{2,8}$/.test(department) &&
    /^[a-z0-9]{3,12}$/.test(course) &&
    /^(19|20)\d{2}$/.test(year) &&
    ["fall", "winter", "summer"].includes(semester)
  )
}
