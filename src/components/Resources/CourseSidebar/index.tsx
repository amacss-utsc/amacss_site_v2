import Link from "next/link";
import type { Semester } from "@/utilities/github-courses";
import { cn } from "@/utilities/cn";

interface SidebarSemester {
  year: number;
  semester: Semester;
}

interface CourseSidebarProps {
  dept: string;
  course: string;
  semesters: SidebarSemester[];
  activeYear: number;
  activeSemester: Semester;
}

function formatSemesterLabel(semester: Semester, year: number) {
  const capitalized = semester.charAt(0).toUpperCase() + semester.slice(1);
  return `${capitalized} ${year}`;
}

export function CourseSidebar({
  dept,
  course,
  semesters,
  activeYear,
  activeSemester,
}: CourseSidebarProps) {
  // Sort latest to oldest
  const sortedSemesters = [...semesters].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    const order: Semester[] = ["winter", "summer", "fall"];
    const idxA = order.indexOf(a.semester);
    const idxB = order.indexOf(b.semester);
    return idxB - idxA;
  });

  return (
    <nav className="min-w-[242px] hidden lg:flex lg:flex-col bg-gray-80 border-r border-gray-70">
      <div className="px-4 pt-5 pb-3 border-b border-gray-70">
        <p className="text-[11px] uppercase tracking-wide text-gray-02">
          Offerings for
        </p>
        <h2 className="text-lg font-semibold text-gray-02">
          {dept.toUpperCase()}{course.toUpperCase()}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {sortedSemesters.length === 0 ? (
          <p className="text-sm text-gray-20">
            No semesters found for this course.
          </p>
        ) : (
          sortedSemesters.map(({ year, semester }) => {
            const href = `/courses/${dept}/${course}/${year}/${semester}`;
            const isActive =
              year === activeYear && semester === activeSemester;

            return (
              <Link
                key={`${year}-${semester}`}
                href={href}
                className={cn(
                  "block w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "text-left",
                  isActive
                    ? "bg-gray-70 text-gray-02"
                    : "text-gray-10 hover:bg-gray-70 hover:text-gray-02"
                )}
              >
                {formatSemesterLabel(semester, year)}
              </Link>
            );
          })
        )}
      </div>
    </nav>
  );
}
