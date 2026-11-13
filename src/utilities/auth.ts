export const UOFT_EMAIL_ERROR = "Use your University of Toronto email address."
export const PHONE_ERROR = "Enter a valid phone number with 10 to 15 digits."
export const STUDY_YEAR_ERROR = "Select your current year of study."
export const ACCOUNT_REGISTRATION_OPEN = true
export const EVENT_REGISTRATION_OPEN = true

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isUofTEmail(email: string) {
  const normalized = normalizeEmail(email)
  const emailParts = normalized.split("@")

  if (
    emailParts.length !== 2 ||
    !emailParts[0] ||
    !emailParts[1] ||
    /\s/.test(normalized)
  ) {
    return false
  }

  const domain = emailParts[1]

  return domain === "utoronto.ca" || domain.endsWith(".utoronto.ca")
}

export function isValidPhoneNumber(phone: string) {
  const value = phone.trim()

  if (!/^\+?[\d\s().-]+$/.test(value)) return false

  const digitCount = value.replace(/\D/g, "").length
  return digitCount >= 10 && digitCount <= 15
}

export function isValidStudyYear(year: number) {
  return Number.isInteger(year) && year >= 1 && year <= 5
}

// Reserved, never-real origin used only to check where a path resolves.
const REDIRECT_BASE = "https://redirect-check.invalid"

export function safeRedirect(value: string | null): string {
  // Real paths always start with a single "/".
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/"
  try {
    const url = new URL(value, REDIRECT_BASE)
    // Any parser quirk that changes the host (backslash, tab/newline, etc.)
    // changes the origin, so it fails this check.
    if (url.origin !== REDIRECT_BASE) return "/"
    return url.pathname + url.search + url.hash
  } catch {
    return "/"
  }
}
