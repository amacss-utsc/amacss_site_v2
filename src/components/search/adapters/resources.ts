import type { SearchItem } from "../types"

export type ResourceIndexItem = {
  id: string
  title: string
  year: number
  semester: "fall" | "winter" | "summer"
  name: string // folder name
  tokens: string[]
  path: string
}

function capitalizeSemester(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function mapResourcesIndexToSearchItems(
  items: ResourceIndexItem[],
): SearchItem[] {
  return items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      subtitle: `${item.year} ${capitalizeSemester(item.semester)}`,
      href: `/resources/${item.year}/${item.semester}/${item.name}`,
      tokens: [...item.tokens, String(item.year), item.semester],
      meta: {
        year: item.year,
        semester: item.semester,
      },
    }
  })
}
