import type { SearchItem } from "../types"
import { getCourseCatalog, getLatestSemester } from "@/utilities/github-courses"

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

/**
 * Get all courses from all departments in the GitHub repo.
 * Returns a list of CourseIndexItem objects for searching.
 */
export async function getAllCourses(): Promise<CourseIndexItem[]> {
  const catalog = await getCourseCatalog()

  return catalog
    .filter((item) => item.semesters.length > 0)
    .map((item) => {
      const { dept, course: courseKey, semesters } = item

      const semesterObjects = semesters.map((sem) => ({
        year: sem.year,
        semester: sem.semester,
        path: `/courses/${dept}/${courseKey}/${sem.year}/${sem.semester}`,
      }))

      const latestSemester = getLatestSemester(semesters)
      const latest = latestSemester
        ? {
            year: latestSemester.year,
            semester: latestSemester.semester,
            path: `/courses/${dept}/${courseKey}/${latestSemester.year}/${latestSemester.semester}`,
          }
        : undefined

      return {
        id: `${dept}-${courseKey}`,
        dept,
        courseKey,
        title: `${dept}${courseKey}`.toUpperCase(),
        tokens: [dept, courseKey, `${dept}${courseKey}`],
        semesters: semesterObjects,
        latest,
      }
    })
}
