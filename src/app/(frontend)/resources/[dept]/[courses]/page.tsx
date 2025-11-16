import { notFound } from "next/navigation";
import {
  Dept,
  getCourseSemesters,
  getLatestSemester,
} from "@/utilities/github-courses";

interface PageProps {
  params: {
    dept: Dept;
    course: string;
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { dept, course } = params;

  const semesters = await getCourseSemesters(dept, course);

  const latest = getLatestSemester(semesters);
  if (!latest) {
    // No semesters exist yet; render the app's not-found page
    notFound();
  }

  notFound();
}
