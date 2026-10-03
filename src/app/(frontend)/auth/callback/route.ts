import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { NextResponse } from "next/server"

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/"
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = safeNextPath(url.searchParams.get("next"))
  const supabase = await createSupabaseServerClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) return NextResponse.redirect(new URL(next, url.origin))
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation-link", url.origin),
  )
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const formData = await request.formData()
  const tokenHash = String(formData.get("token_hash") || "")
  const type = String(formData.get("type") || "")
  const next = safeNextPath(String(formData.get("next") || ""))

  if (tokenHash && type === "recovery") {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    })

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin), { status: 303 })
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation-link", url.origin),
    { status: 303 },
  )
}
