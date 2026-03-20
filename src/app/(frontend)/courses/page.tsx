// "use client"

import React, { Suspense } from "react"
import CourseSearch from "@/components/search/CourseSearch"
import { getAllCourses } from "@/components/search/adapters/courses"

export default async function CoursesPage() {
  const courses = await getAllCourses();
  return (
    <main className="mx-auto max-w-4xl p-6 text-gray-100">
      <header className="mb-6 space-y-2">
  <h1 className="text-2xl font-semibold text-white">Courses</h1>
        <p className="text-sm text-gray-400">
          Search the course archive. Type department codes (e.g. csc), course keys (b63), or keywords
          (&quot;data structures&quot;, &quot;calculus&quot;). URL updates allow sharing deep links.
        </p>
      </header>
      <Suspense fallback={<div className="text-gray-400">Loading courses…</div>}>
        <CourseSearch courses={courses} pageSize={10} persistToUrl={true} />
      </Suspense>
    </main>
  )
}
