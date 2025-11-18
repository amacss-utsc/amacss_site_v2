"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Semester } from "@/utilities/github-courses";
import { cn } from "@/utilities/cn";

interface SemesterOption {
  year: number;
  semester: Semester;
}

interface SemesterSelectProps {
  dept: string;
  course: string;
  semesters: SemesterOption[];
  activeYear: number;
  activeSemester: Semester;
  className?: string;
}

function formatSemesterLabel(semester: Semester, year: number) {
  const capitalized = semester.charAt(0).toUpperCase() + semester.slice(1);
  return `${capitalized} ${year}`;
}

export function SemesterSelect({
  dept,
  course,
  semesters,
  activeYear,
  activeSemester,
  className,
}: SemesterSelectProps) {
  const router = useRouter();

  const sortedSemesters = useMemo(() => {
    const order: Semester[] = ["winter", "summer", "fall"];
    return [...semesters].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return order.indexOf(b.semester) - order.indexOf(a.semester);
    });
  }, [semesters]);

  const activeValue = `${activeYear}-${activeSemester}`;

  return (
    <div className={cn("flex flex-col gap-1 lg:hidden", className)}>
      <label
        htmlFor="semester-select"
        className="text-xs font-medium uppercase tracking-wide text-gray-30"
      >
        Semester
      </label>
      <select
        id="semester-select"
        value={activeValue}
        onChange={(e) => {
          const [yearStr, sem] = e.target.value.split("-");
          const href = `/resources/${dept}/${course}/${yearStr}/${sem}`;
          router.push(href);
        }}
        className="
          w-full rounded-md border border-gray-70
          bg-gray-80 px-3 py-2
          text-sm text-gray-02
          focus:outline-none focus:ring-2 focus:ring-blue-20 focus:border-blue-20
        "
      >
        {sortedSemesters.map(({ year, semester }) => {
          const value = `${year}-${semester}`;
          return (
            <option key={value} value={value}>
              {formatSemesterLabel(semester, year)}
            </option>
          );
        })}
      </select>
    </div>
  );
}
