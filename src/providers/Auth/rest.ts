import { ClubMember } from "@/payload-types"

export const rest = async (
  url: string,
  args?: any,
  options?: RequestInit,
): Promise<null | undefined | ClubMember> => {
  const method = options?.method || "POST"

  try {
    const res = await fetch(url, {
      method,
      ...(method === "POST" ? { body: JSON.stringify(args) } : {}),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    const { errors, user: clubMember } = await res.json()

    if (errors) {
      throw new Error(errors[0].message)
    }

    if (res.ok) {
      return clubMember
    }
  } catch (e: unknown) {
    throw new Error(e as string)
  }
}
