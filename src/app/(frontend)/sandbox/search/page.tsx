"use client"

import React, { useState } from "react"
import CourseSearch from "@/components/search/CourseSearch"
import ResourceSearch from "@/components/search/ResourceSearch"
import { courseIndexMock } from "@/components/search/mocks/courses"
import { resourceIndexMock } from "@/components/search/mocks/resources"

// REMOVE BEFORE PROD: temporary search testing page

export default function Page() {
  const [mode, setMode] = useState<"courses" | "resources">("courses")
  return (
    <main className="mx-auto max-w-3xl p-6 text-gray-100">
      <h1 className="mb-4 text-xl font-semibold text-gray-100">Sandbox: Search Wrappers</h1>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("courses")}
          className={`rounded px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            mode === "courses" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
          aria-pressed={mode === "courses"}
        >
          Courses
        </button>
        <button
          type="button"
          onClick={() => setMode("resources")}
          className={`rounded px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            mode === "resources" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
          aria-pressed={mode === "resources"}
        >
          Resources
        </button>
      </div>
      {mode === "courses" ? (
        <CourseSearch courses={courseIndexMock} pageSize={2} />
      ) : (
        <ResourceSearch resources={resourceIndexMock} pageSize={2} />
      )}
    </main>
  )
}
