import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabasePublishableKey) return response

  // Anonymous visitors have no session to refresh. Match this project's cookie
  // (including chunked cookies), rather than checking for unrelated cookies.
  const authCookie = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`
  if (
    !request.cookies
      .getAll()
      .some(
        ({ name }) => name === authCookie || name.startsWith(`${authCookie}.`),
      )
  )
    return response

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  // Verifies the JWT and refreshes expired sessions. Asymmetric signing keys
  // allow verification with cached public keys instead of an Auth user lookup.
  // Protected handlers still call getUser() for authoritative user information.
  await supabase.auth.getClaims()
  return response
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|apiv2(?:/|$)|admin(?:/|$)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
