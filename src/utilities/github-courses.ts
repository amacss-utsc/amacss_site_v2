export type Dept = "mat" | "sta" | "csc"
export type Semester = "fall" | "winter" | "summer"

export interface CourseSemester {
  year: number
  semester: Semester
}

interface GithubContentItem {
  name: string
  path: string
  type: "file" | "dir"
}

/**
 * Basic GitHub repo config.
 */
const GITHUB_OWNER = "amacss-utsc"
const GITHUB_REPO = "courses"

/**
 * Small helper to talk to the GitHub Contents API.
 */
export async function fetchGithubContents(
  path: string,
): Promise<GithubContentItem[]> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

  const headers: HeadersInit = {}

  // Use a token if available to increase rate limits, but we dont need it if the repo is public
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

  const res = await fetch(url, {
    // headers,
    // Cache a bit so we don't hit GitHub too hard
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      return []
    }
    throw new Error(
      `Failed to fetch GitHub contents for ${path}: ${res.status}`,
    )
  }

  const data = (await res.json()) as GithubContentItem[] | GithubContentItem

  // Contents API returns either an array (for directories) or an object (for files)
  return Array.isArray(data) ? data : [data]
}

/**
 * Get all semesters for a given course from the folder
 * structure: {DEPT}/{COURSE}/{YEAR}/{SEMESTER}.
 */
export async function getCourseSemesters(
  dept: Dept,
  course: string,
): Promise<CourseSemester[]> {
  const basePath = `${dept}/${course}`
  const yearEntries = await fetchGithubContents(basePath)

  const years = yearEntries
    .filter((item) => item.type === "dir" && /^\d{4}$/.test(item.name))
    .map((item) => item.name)

  const semesters: CourseSemester[] = []

  for (const yearStr of years) {
    const year = Number(yearStr)
    const semesterEntries = await fetchGithubContents(`${basePath}/${yearStr}`)

    for (const semesterItem of semesterEntries) {
      if (
        semesterItem.type === "dir" &&
        (semesterItem.name === "fall" ||
          semesterItem.name === "winter" ||
          semesterItem.name === "summer")
      ) {
        semesters.push({
          year,
          semester: semesterItem.name as Semester,
        })
      }
    }
  }

  return semesters.sort(compareSemestersDesc)
}

/**
 * Sort semesters descending (latest first).
 * Later year wins; for same year: winter < summer < fall
 * so fall is considered the "latest" in that year.
 */
export function compareSemestersDesc(
  a: CourseSemester,
  b: CourseSemester,
): number {
  if (a.year !== b.year) {
    return b.year - a.year
  }

  const order: Semester[] = ["winter", "summer", "fall"]
  const idxA = order.indexOf(a.semester)
  const idxB = order.indexOf(b.semester)

  return idxB - idxA
}

/**
 * Pick the "latest" semester from a list (or null if none).
 */
export function getLatestSemester(
  semesters: CourseSemester[],
): CourseSemester | null {
  if (semesters.length === 0) return null
  const sorted = [...semesters].sort(compareSemestersDesc)
  return sorted[0]
}

/**
 * Fetch README.md for a specific course + semester.
 * Uses raw.githubusercontent.com for simplicity.
 */

export async function getReadmeMarkdown(
  dept: Dept,
  course: string,
  year: number,
  semester: Semester,
): Promise<string | null> {
  const path = `${dept}/${course}/${year}/${semester}/README.md`
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`Failed to fetch README.md: ${res.status}`)
  }

  const json = await res.json()

  if (!json.content) return null

  // GitHub returns base64-encoded content
  const buff = Buffer.from(json.content, "base64")
  return buff.toString("utf8")
}
