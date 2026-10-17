import { Event } from "@/payload-types"
import config from "@payload-config"
import { getPayload } from "payload"

;("use server")

type DataError = {
  code: number
  message: string
} | null

type UnpinEventType = {
  success: boolean
  error?: DataError
}

export const unpinEvent = async (event: Event): Promise<UnpinEventType> => {
  const payload = await getPayload({ config })

  if (!payload) {
    return {
      success: false,
      error: {
        code: 500,
        message: "Failed to load Payload Config",
      },
    }
  }

  try {
    const data = await payload.update({
      collection: "events",
      id: event.id,
      data: {
        ribbonTag: null,
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Event update tag error:", error)
    return {
      success: false,
      error: {
        code: 500,
        message: `Failed to update event tag: ${error.message}`,
      },
    }
  }
}
