export type Dept = "mat" | "sta" | "csc"
export type Semester = "fall" | "winter" | "summer"

export interface CourseSemester {
  year: number
  semester: Semester
}

type RepoTreeSnapshot = {
  paths: string[]
  fetchedAt: number
}

type CoursesTreeIndex = Record<Dept, Record<string, CourseSemester[]>>

export interface CourseCatalogItem {
  dept: Dept
  course: string
  semesters: CourseSemester[]
}

interface GithubTreeApiItem {
  path: string
  type: "tree" | "blob"
}

interface GithubTreeApiResponse {
  tree: GithubTreeApiItem[]
  truncated: boolean
}

/**
 * Basic GitHub repo config.
 */
const GITHUB_OWNER = "amacss-utsc"
const GITHUB_REPO = "courses"
const GITHUB_REF = "main"
const TREE_CACHE_TTL_MS = 5 * 60 * 1000

let cachedTreeSnapshotPromise: Promise<RepoTreeSnapshot> | null = null
let cachedTreeIndexPromise: Promise<CoursesTreeIndex> | null = null

/**
 * Fetch the entire repository tree in one API call.
 */
async function fetchRepoTreeRecursive(): Promise<RepoTreeSnapshot> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_REF}?recursive=1`
  const res = await fetch(url, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub tree: ${res.status}`)
  }

  const data = (await res.json()) as GithubTreeApiResponse
  if (data.truncated) {
    // Tree API may truncate huge repos; fail fast so callers do not use partial data.
    throw new Error("GitHub tree response was truncated")
  }

  return {
    paths: data.tree.map((item) => item.path),
    fetchedAt: Date.now(),
  }
}

/**
 * Shared in-memory tree snapshot promise.
 * This keeps one tree fetch per runtime and lets callers await the same request.
 */
function getCachedGithubTree(): Promise<RepoTreeSnapshot> {
  if (!cachedTreeSnapshotPromise) {
    cachedTreeSnapshotPromise = fetchRepoTreeRecursive()
    return cachedTreeSnapshotPromise
  }

  return cachedTreeSnapshotPromise.then((snapshot) => {
    const isStale = Date.now() - snapshot.fetchedAt > TREE_CACHE_TTL_MS
    if (!isStale) return snapshot

    cachedTreeSnapshotPromise = fetchRepoTreeRecursive()
    cachedTreeIndexPromise = null
    return cachedTreeSnapshotPromise
  })
}

/**
 * Allows explicit cache invalidation (useful for tests/manual refresh hooks).
 */
export function clearCachedGithubTree(): void {
  cachedTreeSnapshotPromise = null
  cachedTreeIndexPromise = null
}

const COURSE_SEMESTER_PATH_RE =
  /^(mat|sta|csc)\/([^/]+)\/(\d{4})\/(fall|winter|summer)(?:\/|$)/

function parseCourseSemesterPath(path: string): {
  dept: Dept
  course: string
  year: number
  semester: Semester
} | null {
  const match = COURSE_SEMESTER_PATH_RE.exec(path)
  if (!match) return null

  const [, deptRaw, course, yearRaw, semesterRaw] = match

  return {
    dept: deptRaw as Dept,
    course,
    year: Number(yearRaw),
    semester: semesterRaw as Semester,
  }
}

/**
 * Step 4: Build a deterministic, deduped course index from tree paths.
 */
function buildCoursesTreeIndex(snapshot: RepoTreeSnapshot): CoursesTreeIndex {
  const byDept = new Map<Dept, Map<string, Set<string>>>()

  for (const path of snapshot.paths) {
    const parsed = parseCourseSemesterPath(path)
    if (!parsed) continue

    const courseMap = byDept.get(parsed.dept) ?? new Map<string, Set<string>>()
    const semesterKey = `${parsed.year}|${parsed.semester}`
    const semesterSet = courseMap.get(parsed.course) ?? new Set<string>()

    semesterSet.add(semesterKey)
    courseMap.set(parsed.course, semesterSet)
    byDept.set(parsed.dept, courseMap)
  }

  const coursesByDept: CoursesTreeIndex = {
    mat: {},
    sta: {},
    csc: {},
  }

  for (const dept of ["mat", "sta", "csc"] as const) {
    const courseMap = byDept.get(dept)
    if (!courseMap) continue

    for (const [course, semesterSet] of courseMap.entries()) {
      const semesters = Array.from(semesterSet, (value) => {
        const [yearRaw, semesterRaw] = value.split("|")
        return {
          year: Number(yearRaw),
          semester: semesterRaw as Semester,
        }
      }).sort(compareSemestersDesc)

      coursesByDept[dept][course] = semesters
    }
  }

  return coursesByDept
}

/**
 * Shared in-memory index promise built from the cached tree snapshot.
 */
async function getCachedCoursesTreeIndex(): Promise<CoursesTreeIndex> {
  if (!cachedTreeIndexPromise) {
    cachedTreeIndexPromise = getCachedGithubTree().then((snapshot) =>
      buildCoursesTreeIndex(snapshot),
    )
  }
  return cachedTreeIndexPromise
}

/**
 * List all courses from the cached tree index.
 */
export async function getCourseCatalog(): Promise<CourseCatalogItem[]> {
  const index = await getCachedCoursesTreeIndex()
  const catalog: CourseCatalogItem[] = []

  for (const dept of ["mat", "sta", "csc"] as const) {
    for (const course of Object.keys(index[dept]).sort((a, b) =>
      a.localeCompare(b),
    )) {
      const semesters = [...index[dept][course]].sort(compareSemestersDesc)
      catalog.push({ dept, course, semesters })
    }
  }

  return catalog
}

/**
 * Get all semesters for a given course from the folder
 * structure: {DEPT}/{COURSE}/{YEAR}/{SEMESTER}.
 */
export async function getCourseSemesters(
  dept: Dept,
  course: string,
): Promise<CourseSemester[]> {
  const index = await getCachedCoursesTreeIndex()
  const semesters = index[dept][course] ?? []
  return [...semesters].sort(compareSemestersDesc)
}

/**
 * Read the latest offering directly from the cached index.
 */
export async function getLatestCourseSemester(
  dept: Dept,
  course: string,
): Promise<CourseSemester | null> {
  const index = await getCachedCoursesTreeIndex()
  const semesters = index[dept][course] ?? []
  return semesters[0] ?? null
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
 * Uses raw.githubusercontent.com to avoid Contents API JSON/base64 overhead.
 */

export async function getReadmeMarkdown(
  dept: Dept,
  course: string,
  year: number,
  semester: Semester,
): Promise<string | null> {
  const path = `${dept}/${course}/${year}/${semester}/README.md`
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_REF}/${path}`

  const res = await fetch(url, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`Failed to fetch README.md: ${res.status}`)
  }

  return res.text()
}
