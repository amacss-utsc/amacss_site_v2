import "server-only"
import { createClient } from "@supabase/supabase-js"

export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY
  if (!url || !key) throw new Error("Supabase server credentials are missing.")

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (publicUrl && new URL(url).hostname !== new URL(publicUrl).hostname) {
    throw new Error(
      "SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL point to different projects.",
    )
  }
  if (key.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SECRET_KEY/SUPABASE_KEY contains a publishable key instead of a server secret.",
    )
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
