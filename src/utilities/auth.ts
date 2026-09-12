export const UOFT_EMAIL_ERROR = "Use your University of Toronto email address."
export const PHONE_ERROR = "Enter a valid phone number with 10 to 15 digits."
export const ACCOUNT_REGISTRATION_OPEN = true
export const EVENT_REGISTRATION_OPEN = false

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
