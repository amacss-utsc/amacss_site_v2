import {
  type Dept,
  type Semester,
  getCourseSemesters,
  getReadmeMarkdown,
} from "@/utilities/github-courses"
import { CourseSidebar } from "@/components/Resources/CourseSidebar"
import { MarkdownViewer } from "@/components/Resources/MarkdownViewer"
import { SemesterSelect } from "@/components/Resources/SemesterSelect"

type PageProps = {
  params: Promise<{
    dept: Dept
    course: string
    year: string
    semester: Semester
  }>
}

export default async function CourseSemesterPage({ params }: PageProps) {
  const { dept, course, year, semester } = await params

  const yearNumber = Number(year)
  if (Number.isNaN(yearNumber)) {
    throw new Error("Invalid year parameter")
  }

  const semesters = await getCourseSemesters(dept, course)

  const exists = semesters.some(
    (s) => s.year === yearNumber && s.semester === semester,
  )
  if (!exists) {
    throw new Error("Requested semester does not exist for this course")
  }

  const markdown = await getReadmeMarkdown(dept, course, yearNumber, semester)

  return (
    <div
      className="
        flex
        bg-gray-90
        min-h-[calc(100vh-56px)]
        pt-20 lg:pt-0
      "
    >
      {/* Left: resources sidebar (desktop only) */}
      <CourseSidebar
        dept={dept}
        course={course}
        semesters={semesters}
        activeYear={yearNumber}
        activeSemester={semester}
      />

      {/* Right: main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-70 px-4 py-3 bg-gray-80">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold text-gray-02 flex flex-col lg:flex-row lg:items-center gap-2">
              <span>
                {dept.toUpperCase()}{course.toUpperCase()} 
              </span>

              <span className="hidden lg:inline">
                {semester.charAt(0).toUpperCase() + semester.slice(1)} {year}
              </span>

              {/* Mobile: show dropdown */}
              <span className="lg:hidden w-full">
                <SemesterSelect
                  dept={dept}
                  course={course}
                  semesters={semesters}
                  activeYear={yearNumber}
                  activeSemester={semester}
                  className="w-full"
                />
              </span>
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <MarkdownViewer markdown={markdown} />
        </main>
      </div>
    </div>
  )
}
