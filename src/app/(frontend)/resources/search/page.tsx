"use client"

import React from "react"
import ResourceSearch from "@/components/search/ResourceSearch"
import { resourceIndexMock } from "@/components/search/mocks/resources"

// REMOVE BEFORE PROD: temporary search testing page
// Dedicated resource search page using list mode and mock data.
// TODO: Swap mock import for real index JSON or fetch when available.

export default function ResourceSearchPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 text-gray-100">
      <header className="mb-6 space-y-2">
  <h1 className="text-2xl font-semibold text-white">Search Resources</h1>
        <p className="text-sm text-gray-400">
          Find workshops and study aids. Try keywords (git, resume), semester (fall), or year.
        </p>
      </header>
      <ResourceSearch resources={resourceIndexMock} pageSize={10} persistToUrl={true} />
    </main>
  )
}
