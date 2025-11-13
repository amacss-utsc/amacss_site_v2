"use client"

import React, { useState } from "react"
import { type CourseIndexItem } from "@/components/search/adapters/courses"
import { type ResourceIndexItem } from "@/components/search/adapters/resources"
import CourseSearch from "@/components/search/CourseSearch"
import ResourceSearch from "@/components/search/ResourceSearch"

// raw mock index items (simulate future GitHub-generated JSON)
const courseIndexMock: CourseIndexItem[] = [
  {
    id: "mat-a31",
    dept: "mat",
    courseKey: "a31",
    title: "MATA31 — Calculus I",
    tokens: ["mat", "mata31", "a31", "calculus", "calc 1"],
    semesters: [
      { year: 2025, semester: "fall", path: "mat/a31/2025/fall" },
      { year: 2024, semester: "winter", path: "mat/a31/2024/winter" },
    ],
    latest: { year: 2025, semester: "fall", path: "mat/a31/2025/fall" },
  },
  {
    id: "csc-b63",
    dept: "csc",
    courseKey: "b63",
    title: "CSCB63 — Design and Analysis of Data Structures",
    tokens: ["csc", "cscb63", "b63", "data structures", "dsa"],
    semesters: [
      { year: 2024, semester: "winter", path: "csc/b63/2024/winter" },
      { year: 2023, semester: "fall", path: "csc/b63/2023/fall" },
    ],
    latest: { year: 2024, semester: "winter", path: "csc/b63/2024/winter" },
  },
  {
    id: "sta-b57",
    dept: "sta",
    courseKey: "b57",
    title: "STAB57 — Probability and Statistics I",
    tokens: ["sta", "stab57", "b57", "probability", "statistics"],
    semesters: [
      { year: 2023, semester: "fall", path: "sta/b57/2023/fall" },
    ],
    latest: { year: 2023, semester: "fall", path: "sta/b57/2023/fall" },
  },
]

const resourceIndexMock: ResourceIndexItem[] = [
  {
    id: "2025-fall-welcome-workshop",
    title: "Welcome Workshop",
    year: 2025,
    semester: "fall",
    name: "welcome-workshop",
    tokens: ["welcome", "workshop", "fall", "2025"],
    path: "2025/fall/welcome-workshop",
  },
  {
    id: "2024-winter-algorithms-review",
    title: "Algorithms Review",
    year: 2024,
    semester: "winter",
    name: "algorithms-review",
    tokens: ["algorithms", "review", "winter", "2024"],
    path: "2024/winter/algorithms-review",
  },
]

// We now rely on wrapper components to adapt raw mocks.

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
