
import {
  Dept,
  Semester,
  getCourseSemesters,
  getReadmeMarkdown,
} from "@/utilities/github-courses";
import { CourseSidebar } from "@/components/Resources/CourseSidebar/index";
import { MarkdownViewer } from "@/components/Resources/MarkdownViewer/index";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    dept: Dept;
    course: string;
    year: string;
    semester: Semester;
  };
}

export default async function CourseSemesterPage({ params }: PageProps) {
  const { dept, course, year, semester } = params;

  const yearNumber = Number(year);
  if (Number.isNaN(yearNumber)) {
    notFound();
  }

  const semesters = await getCourseSemesters(dept, course);

  // Optional: ensure the requested semester actually exists, otherwise 404
  const exists = semesters.some(
    (s) => s.year === yearNumber && s.semester === semester,
  );
  if (!exists) {
    // Render the app's not-found page for a missing semester
    notFound();
  }

  const markdown = await getReadmeMarkdown(
    dept,
    course,
    yearNumber,
    semester,
  );

  return (
    <SidebarProvider>
      <div className="flex h-full min-h-screen">
        <CourseSidebar
          dept={dept}
          course={course}
          semesters={semesters}
          activeYear={yearNumber}
          activeSemester={semester}
        />
        <SidebarInset className="flex-1 overflow-y-auto">
          <header className="border-b px-4 py-3">
            <h1 className="text-xl font-semibold">
              {dept.toUpperCase()} {course.toUpperCase()} –{" "}
              {semester.charAt(0).toUpperCase() + semester.slice(1)} {year}
            </h1>
          </header>
          <main>
            <MarkdownViewer markdown={markdown} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
