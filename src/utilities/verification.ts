import "server-only"
import { createHmac } from "node:crypto"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import { isUofTEmail, normalizeEmail } from "@/utilities/auth"

export function hashEmailCode(userId: string, email: string, code: string) {
  const secret = process.env.EMAIL_VERIFICATION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("EMAIL_VERIFICATION_SECRET must be at least 32 characters.")
  }
  return createHmac("sha256", secret)
    .update(`${userId}:${normalizeEmail(email)}:${code}`)
    .digest("hex")
}

export async function getEmailVerification(user: {
  id: string
  email?: string | null
}) {
  if (!user.email || !isUofTEmail(user.email)) return false
  try {
    const admin = createSupabaseAdminClient()
    const { data, error } = await admin
      .from("member_profiles")
      .select("email,email_verified_at")
      .eq("id", user.id)
      .single()
    if (error) throw error
    return (
      normalizeEmail(data.email) === normalizeEmail(user.email) &&
      Boolean(data.email_verified_at)
    )
  } catch (error) {
    console.error("Could not read email verification state", error)
    return false
  }
}
