"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Semester } from "@/utilities/github-courses";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  const sortedSemesters = useMemo(
    () =>
      [...semesters].sort((a, b) => {
        // reuse same logic as compareSemestersDesc but inline to avoid importing
        if (a.year !== b.year) return b.year - a.year;
        const order: Semester[] = ["winter", "summer", "fall"];
        const idxA = order.indexOf(a.semester);
        const idxB = order.indexOf(b.semester);
        return idxB - idxA;
      }),
    [semesters],
  );

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {dept.toUpperCase()} {course.toUpperCase()}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sortedSemesters.map(({ year, semester }) => {
                const href = `/resources/${dept}/${course}/${year}/${semester}`;
                const isActive = year === activeYear && semester === activeSemester;

                return (
                  <SidebarMenuItem key={`${year}-${semester}`}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={href}>
                        <span>{formatSemesterLabel(semester, year)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
