import "server-only"

export function smsIsConfigured() {
  const httpsUrl = (value?: string) => {
    try {
      return new URL(value || "").protocol === "https:"
    } catch {
      return false
    }
  }
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_MESSAGING_SERVICE_SID &&
    httpsUrl(process.env.SMS_TERMS_URL) &&
    httpsUrl(process.env.SMS_PRIVACY_URL),
  )
}

export function normalizeSmsPhone(value: string) {
  const digits = value.replace(/\D/g, "")
  if (digits.length === 10) return `+1${digits}`
  if (
    digits.length >= 11 &&
    digits.length <= 15 &&
    value.trim().startsWith("+")
  )
    return `+${digits}`
  return null
}

export async function sendTransactionalSms(to: string, body: string) {
  if (!smsIsConfigured()) throw new Error("Twilio SMS is not configured.")
  const phone = normalizeSmsPhone(to)
  if (!phone) throw new Error("SMS phone must be in E.164 format.")
  const sid = process.env.TWILIO_ACCOUNT_SID!
  const token = process.env.TWILIO_AUTH_TOKEN!
  const form = new URLSearchParams({
    To: phone,
    MessagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
    Body: body,
  })
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    },
  )
  if (!response.ok) {
    console.error("Twilio SMS failed", response.status, await response.text())
    throw new Error("SMS could not be sent.")
  }
}
