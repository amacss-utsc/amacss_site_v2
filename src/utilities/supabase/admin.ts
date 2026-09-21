import "server-only"
import { createClient } from "@supabase/supabase-js"

export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY
  if (!url || !key) throw new Error("Supabase server credentials are missing.")

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
