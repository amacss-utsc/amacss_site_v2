import type { SearchItem } from "./types"

function normalize(text: string): string {
  return text.toLowerCase()
}

export function splitQuery(q: string): string[] {
  return normalize(q).split(/\s+/).filter(Boolean)
}

export function matchesQuery(item: SearchItem, q: string): boolean {
  const terms = splitQuery(q)
  if (terms.length === 0) return true

  const title = normalize(item.title)
  const tokens = new Set<string>(item.tokens.map(normalize))

  return terms.every((t) => title.includes(t) || tokens.has(t))
}

export function filterItems(
  items: SearchItem[],
  q: string,
  _filters?: Record<string, string | string[]>,
): SearchItem[] {
  if (!q.trim()) return items
  return items.filter((it) => matchesQuery(it, q))
}
