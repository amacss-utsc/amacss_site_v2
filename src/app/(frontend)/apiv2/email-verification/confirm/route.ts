import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import { hashEmailCode } from "@/utilities/verification"

export async function POST(req: Request) {
  try {
    const auth = await createSupabaseServerClient()
    const {
      data: { user },
    } = await auth.auth.getUser()
    if (!user || !user.email)
      return NextResponse.json({ error: "Sign in first." }, { status: 401 })
    const body = await req.json()
    const code = String(body?.code || "").trim()
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Enter the six-digit code." },
        { status: 400 },
      )
    }
    const admin = createSupabaseAdminClient()
    const { data: verified, error } = await admin.rpc(
      "confirm_member_email_code",
      {
        p_member_id: user.id,
        p_hash: hashEmailCode(user.id, user.email, code),
      },
    )
    if (error) throw error
    if (!verified)
      return NextResponse.json(
        { error: "Invalid or expired code." },
        { status: 400 },
      )
    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error("Email verification confirmation failed", error)
    return NextResponse.json(
      { error: "Could not verify your email." },
      { status: 500 },
    )
  }
}
