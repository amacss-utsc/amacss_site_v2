/** Keep post-auth navigation on this site, including check-in query parameters. */
export function safeLocalPath(
  value: string | null | undefined,
  fallback = "/",
) {
  if (
    !value?.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback
  }

  try {
    const url = new URL(value, "https://amacss.invalid")
    if (url.origin !== "https://amacss.invalid") return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
