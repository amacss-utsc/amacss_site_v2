import { useEffect, useState } from "react"

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), Math.max(0, delayMs))
    return () => clearTimeout(handle)
  }, [value, delayMs])

  return debounced
}
