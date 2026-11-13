"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { buildCheckInPath } from "@/utilities/eventCheckInLink"

type CheckInResult =
  | { kind: "checking" }
  | { kind: "claimed"; pointsAwarded: number; pointsBalance: number }
  | { kind: "already_claimed" }
  | { kind: "sign_in_required" }
  | { kind: "email_unverified" }
  | { kind: "error"; message: string; canRetry: boolean }

type ApiResult = {
  status?: string
  pointsAwarded?: number
  pointsBalance?: number
  error?: string
}

export function EventCheckIn({
  eventId,
  code,
  memberId,
}: {
  eventId: number
  code: string
  memberId: string | null
}) {
  const router = useRouter()
  const [result, setResult] = useState<CheckInResult>({ kind: "checking" })
  const [retry, setRetry] = useState(0)
  const attempt = useRef<{
    key: string
    promise: Promise<{ response: Response; data: ApiResult }>
  } | null>(null)
  const completedKey = useRef<string | null>(null)

  const returnPath = buildCheckInPath({ eventId, code })
  const loginHref = `/login?redirect=${encodeURIComponent(returnPath)}`
  const verifyHref = `/profile?next=${encodeURIComponent(returnPath)}`

  useEffect(() => {
    if (!memberId) return
    const key = `${memberId}:${eventId}:${code}:${retry}`
    if (completedKey.current === key) return

    let active = true
    if (attempt.current?.key !== key) {
      attempt.current = {
        key,
        promise: fetch(`/apiv2/events/${eventId}/check-in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({ attendanceCode: code }),
        }).then(async (response) => ({
          response,
          data: (await response.json().catch(() => ({}))) as ApiResult,
        })),
      }
    }

    setResult({ kind: "checking" })
    attempt.current.promise
      .then(({ response, data }) => {
        if (!active) return
        completedKey.current = key
        if (
          response.ok &&
          data.status === "claimed" &&
          Number.isSafeInteger(data.pointsAwarded) &&
          Number.isSafeInteger(data.pointsBalance)
        ) {
          setResult({
            kind: "claimed",
            pointsAwarded: data.pointsAwarded!,
            pointsBalance: data.pointsBalance!,
          })
          router.refresh()
        } else if (response.ok && data.status === "already_claimed") {
          setResult({ kind: "already_claimed" })
        } else if (response.status === 401) {
          setResult({ kind: "sign_in_required" })
        } else if (data.status === "email_unverified") {
          setResult({ kind: "email_unverified" })
        } else {
          setResult({
            kind: "error",
            message: data.error || "Could not check in. Please try again.",
            canRetry: response.status >= 500,
          })
        }
      })
      .catch(() => {
        if (!active) return
        completedKey.current = key
        setResult({
          kind: "error",
          message: "Could not check in. Please try again.",
          canRetry: true,
        })
      })

    return () => {
      active = false
    }
  }, [code, eventId, memberId, retry, router])

  return (
    <section
      aria-labelledby="event-check-in-heading"
      className="mb-8 rounded-2xl border border-blue-30 bg-gray-80 p-5 lg:p-6"
    >
      <h2 id="event-check-in-heading" className="text-xl font-bold text-white">
        Event check-in
      </h2>
      <div aria-live="polite" className="mt-3 text-base text-gray-02">
        {!memberId || result.kind === "sign_in_required" ? (
          <>
            <p>Log in to claim your event points.</p>
            <Link
              href={loginHref}
              className="mt-4 inline-block rounded-xl bg-blue-30 px-5 py-3 font-bold text-white hover:bg-blue-40"
            >
              Log in to check in
            </Link>
          </>
        ) : result.kind === "checking" ? (
          <p>Checking you in...</p>
        ) : result.kind === "claimed" ? (
          <p role="status">
            You received {result.pointsAwarded}{" "}
            {result.pointsAwarded === 1 ? "point" : "points"}. You now have{" "}
            {result.pointsBalance}{" "}
            {result.pointsBalance === 1 ? "point" : "points"}.
          </p>
        ) : result.kind === "already_claimed" ? (
          <p role="status">You already checked in for this event.</p>
        ) : result.kind === "email_unverified" ? (
          <>
            <p>Verify your U of T email before checking in.</p>
            <Link
              href={verifyHref}
              className="mt-4 inline-block rounded-xl bg-blue-30 px-5 py-3 font-bold text-white hover:bg-blue-40"
            >
              Verify email
            </Link>
          </>
        ) : (
          <>
            <p role="alert">{result.message}</p>
            {result.canRetry ? (
              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="mt-4 rounded-xl bg-blue-30 px-5 py-3 font-bold text-white hover:bg-blue-40"
              >
                Try again
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
