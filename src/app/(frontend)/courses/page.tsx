"use client"

import React from "react"
import CourseSearch from "@/components/search/CourseSearch"
import { courseIndexMock } from "@/components/search/mocks/courses"

// REMOVE BEFORE PROD: temporary search testing page
// TODO: Replace mock import with real index loading (static JSON or server fetch) when available.
// For now we keep this page lean and client-side for manual testing.

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 text-gray-100">
      <header className="mb-6 space-y-2">
  <h1 className="text-2xl font-semibold text-white">Courses</h1>
        <p className="text-sm text-gray-400">
          Search the course archive. Type department codes (e.g. csc), course keys (b63), or keywords
          ("data structures", "calculus"). URL updates allow sharing deep links.
        </p>
      </header>
      <CourseSearch courses={courseIndexMock} pageSize={10} persistToUrl={true} />
    </main>
  )
}
