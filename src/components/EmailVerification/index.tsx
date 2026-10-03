"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function EmailVerification({ verified }: { verified: boolean }) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function sendCode() {
    setBusy(true)
    try {
      const response = await fetch("/apiv2/email-verification/send", { method: "POST" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not send a code.")
      setSent(true)
      toast.success("Check your U of T inbox for a code.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send a code.")
    } finally {
      setBusy(false)
    }
  }

  async function confirmCode(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      const response = await fetch("/apiv2/email-verification/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not verify your email.")
      toast.success("Your email is verified!")
      const next = new URLSearchParams(window.location.search).get("next")
      if (next?.startsWith("/register/event/")) router.push(next)
      else router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify your email.")
    } finally {
      setBusy(false)
    }
  }

  if (verified) {
    return <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-400/50 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400">Email verified</div>
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-red-400/50 bg-red-500/10 p-4 normal-case text-red-300">
      <p className="font-bold">Email not verified</p>
      <p className="mt-1 text-sm">Verify your U of T inbox before registering for events.</p>
      <button type="button" disabled={busy} onClick={sendCode} className="mt-3 rounded-xl bg-blue-30 px-4 py-2 font-bold text-white disabled:opacity-60">{sent ? "Send another code" : "Send verification code"}</button>
      {sent && (
        <form onSubmit={confirmCode} className="mt-4 flex flex-wrap gap-2">
          <input aria-label="Six-digit verification code" autoComplete="one-time-code" inputMode="numeric" maxLength={6} pattern="[0-9]{6}" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="6-digit code" className="min-w-0 flex-1 rounded-xl bg-gray-90 px-3 py-2 text-white" required />
          <button disabled={busy || code.length !== 6} type="submit" className="rounded-xl bg-blue-30 px-4 py-2 font-bold text-white disabled:opacity-60">Verify</button>
        </form>
      )}
    </div>
  )
}
