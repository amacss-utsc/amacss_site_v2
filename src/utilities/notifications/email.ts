import "server-only"

export async function sendTransactionalEmail(args: {
  to: string
  subject: string
  html: string
  text: string
  idempotencyKey?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) throw new Error("Resend is not configured.")

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(args.idempotencyKey
        ? { "Idempotency-Key": args.idempotencyKey }
        : {}),
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: args.subject,
      html: args.html,
      text: args.text,
    }),
  })
  if (!response.ok) {
    console.error("Resend send failed", response.status, await response.text())
    throw new Error("Email could not be sent.")
  }
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const escaped: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }
    return escaped[character]
  })
}
