"use client"

import React from "react"
import HeadlessSearch from "@/components/search/HeadlessSearch"
import type { SearchItem } from "@/components/search/types"

const items: SearchItem[] = [
  {
    id: "mat-a31",
    title: "MATA31 — Calculus I",
    subtitle: "Latest: 2025 Fall • 7 semesters",
    href: "/courses/mat/a31",
    tokens: ["mat", "mata31", "a31", "calculus", "calc 1"],
  },
  {
    id: "csc-b63",
    title: "CSCB63 — Design and Analysis of Data Structures",
    subtitle: "Latest: 2024 Winter • 5 semesters",
    href: "/courses/csc/b63",
    tokens: ["csc", "cscb63", "b63", "data structures", "dsa"],
  },
  {
    id: "sta-b57",
    title: "STAB57 — Probability and Statistics I",
    subtitle: "Latest: 2023 Fall • 3 semesters",
    href: "/courses/sta/b57",
    tokens: ["sta", "stab57", "b57", "probability", "statistics"],
  },
]

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-gray-100">
      <h1 className="mb-4 text-xl font-semibold text-gray-100">Sandbox: Headless Search (list mode)</h1>
      <HeadlessSearch
        dataSource={{ list: items }}
        pageSize={2}
        debounceMs={200}
        persistToUrl={true}
        renderItem={(item) => (
          <a
            href={item.href}
            className="flex items-center justify-between hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          >
            <div>
              <div className="font-medium text-gray-100">{item.title}</div>
              {item.subtitle && (
                <div className="text-xs text-gray-400">{item.subtitle}</div>
              )}
            </div>
            <span aria-hidden>→</span>
          </a>
        )}
        emptyState={<div className="text-gray-300">No matching items.</div>}
        loadingState={<div className="text-xs text-gray-400">Searching…</div>}
      />
    </main>
  )
}
