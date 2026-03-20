import { redirect } from "next/navigation";
import {
  getLatestCourseSemester,
  type Dept,
} from "@/utilities/github-courses";

type PageProps = {
  params: Promise<{
    dept: Dept;
    course: string;
  }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { dept, course } = await params;

  const latest = await getLatestCourseSemester(dept, course);

  if (!latest) {
    // No semesters: send them back to the main resources page
    redirect("/courses");
  }

  redirect(`/courses/${dept}/${course}/${latest.year}/${latest.semester}`);
}
