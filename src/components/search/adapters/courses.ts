import type { SearchItem } from "../types"

export type CourseIndexItem = {
  id: string
  dept: "mat" | "sta" | "csc"
  courseKey: string
  title: string
  tokens: string[]
  semesters: Array<{
    year: number
    semester: "fall" | "winter" | "summer"
    path: string
  }>
  latest?: {
    year: number
    semester: "fall" | "winter" | "summer"
    path: string
  }
}

function capitalizeSemester(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function mapCoursesIndexToSearchItems(
  items: CourseIndexItem[],
): SearchItem[] {
  return items.map((item) => {
    const latest = item.latest || item.semesters[0]
    const semestersCount = item.semesters.length
    const subtitle = latest
      ? `Latest: ${latest.year} ${capitalizeSemester(latest.semester)} • ${semestersCount} semester${semestersCount === 1 ? "" : "s"}`
      : "No semesters yet"
    return {
      id: item.id,
      title: item.title,
      subtitle,
      href: `/courses/${item.dept}/${item.courseKey}`,
      tokens: [...item.tokens, item.dept, item.courseKey],
      meta: {
        dept: item.dept,
        courseKey: item.courseKey,
        semestersCount,
      },
    }
  })
}
