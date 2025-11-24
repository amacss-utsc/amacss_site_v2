import type { SearchItem } from "../types"
import {
  fetchGithubContents,
  getCourseSemesters,
  getLatestSemester,
  type Dept,
} from "@/utilities/github-courses"

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
  const departments: Dept[] = ["mat", "sta", "csc"]
  const courses: CourseIndexItem[] = []

  for (const dept of departments) {
    // Get all course directories for this department
    const courseEntries = await fetchGithubContents(dept)

    const courseDirs = courseEntries
      .filter((item: { type: string; name: string }) => item.type === "dir")
      .map((item: { name: string }) => item.name)

    for (const courseKey of courseDirs) {
      try {
        // Get all semesters for this course
        const semesters = await getCourseSemesters(dept, courseKey)

        if (semesters.length === 0) continue

        // Build semester objects with paths
        const semesterObjects = semesters.map((sem) => ({
          year: sem.year,
          semester: sem.semester,
          path: `/courses/${dept}/${courseKey}/${sem.year}/${sem.semester}`,
        }))

        // Get the latest semester
        const latestSemester = getLatestSemester(semesters)
        const latest = latestSemester
          ? {
              year: latestSemester.year,
              semester: latestSemester.semester,
              path: `/courses/${dept}/${latestSemester.year}/${latestSemester.semester}`,
            }
          : undefined

        courses.push({
          id: `${dept}-${courseKey}`,
          dept,
          courseKey,
          title: `${dept}${courseKey}`.toUpperCase(),
          tokens: [dept, courseKey, `${dept}${courseKey}`],
          semesters: semesterObjects,
          latest,
        })
      } catch (error) {
        console.error(
          `Failed to fetch semesters for ${dept}/${courseKey}:`,
          error,
        )
        continue
      }
    }
  }

  return courses
}
