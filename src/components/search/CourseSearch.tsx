"use client"

import React from "react"
import HeadlessSearch from "@/components/search/HeadlessSearch"
import { mapCoursesIndexToSearchItems, type CourseIndexItem } from "@/components/search/adapters/courses"

export type CourseSearchProps = {
  courses: CourseIndexItem[]
  pageSize?: number
  debounceMs?: number
  persistToUrl?: boolean
  className?: string
}

export function CourseSearch({
  courses,
  pageSize = 20,
  debounceMs = 200,
  persistToUrl = true,
  className,
}: CourseSearchProps) {
  const items = mapCoursesIndexToSearchItems(courses)
  return (
    <div className={className}>
      <HeadlessSearch
        dataSource={{ list: items }}
        pageSize={pageSize}
        debounceMs={debounceMs}
        persistToUrl={persistToUrl}
        renderItem={(item, state) => (
          <a
            href={item.href}
            className={`flex items-center justify-between rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.active ? "font-semibold" : ""
            }`}
          >
            <div>
              <div className="text-sm text-gray-100">{item.title}</div>
              {item.subtitle && (
                <div className="text-xs text-gray-400">{item.subtitle}</div>
              )}
            </div>
            <span aria-hidden className="text-gray-400">
              →
            </span>
          </a>
        )}
        emptyState={<div className="text-gray-300">No courses found.</div>}
        loadingState={<div className="text-xs text-gray-400">Searching courses…</div>}
      />
    </div>
  )
}

export default CourseSearch