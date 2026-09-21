import { randomInt } from "node:crypto"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/utilities/supabase/server"
import { createSupabaseAdminClient } from "@/utilities/supabase/admin"
import { getEmailVerification, hashEmailCode } from "@/utilities/verification"
import { isUofTEmail, normalizeEmail } from "@/utilities/auth"
import { sendTransactionalEmail } from "@/utilities/notifications/email"

export async function POST() {
  try {
    const auth = await createSupabaseServerClient()
    const {
      data: { user },
    } = await auth.auth.getUser()
    if (!user)
      return NextResponse.json({ error: "Sign in first." }, { status: 401 })
    if (!user.email || !isUofTEmail(user.email)) {
      return NextResponse.json(
        { error: "A U of T email is required." },
        { status: 400 },
      )
    }
    if (await getEmailVerification(user)) {
      return NextResponse.json(
        { error: "Email is already verified." },
        { status: 409 },
      )
    }
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json(
        { error: "Email verification is not available yet." },
        { status: 503 },
      )
    }

    const admin = createSupabaseAdminClient()
    const { data: profile, error: profileError } = await admin
      .from("member_profiles")
      .select("email")
      .eq("id", user.id)
      .single()
    if (profileError) throw profileError
    if (normalizeEmail(profile.email) !== normalizeEmail(user.email)) {
      return NextResponse.json(
        { error: "Your account email is updating. Please try again shortly." },
        { status: 409 },
      )
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0")
    const { data: result, error } = await admin.rpc(
      "reserve_member_email_code",
      {
        p_member_id: user.id,
        p_hash: hashEmailCode(user.id, user.email, code),
      },
    )
    if (error) throw error
    if (result !== "sent") {
      const messages: Record<string, string> = {
        cooldown: "Wait one minute before requesting another code.",
        member_limit:
          "You have requested three codes today. Try again tomorrow.",
        daily_limit:
          "Today's email verification limit has been reached. Try again tomorrow.",
        unavailable: "This account cannot be verified right now.",
      }
      return NextResponse.json(
        { error: messages[result] || "Could not send a code." },
        { status: 429 },
      )
    }

    await sendTransactionalEmail({
      to: user.email,
      subject: "Your AMACSS email verification code",
      text: `Your AMACSS verification code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
      html: `<p>Your AMACSS verification code is <strong style="font-size:28px;letter-spacing:4px">${code}</strong>.</p><p>It expires in 10 minutes. If you did not request it, ignore this email.</p>`,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email verification send failed", error)
    return NextResponse.json(
      { error: "Could not send a verification code." },
      { status: 500 },
    )
  }
}
