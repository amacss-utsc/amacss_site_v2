"use client"

import React from "react"
import HeadlessSearch from "@/components/search/HeadlessSearch"
import { mapResourcesIndexToSearchItems, type ResourceIndexItem } from "@/components/search/adapters/resources"

export type ResourceSearchProps = {
  resources: ResourceIndexItem[]
  pageSize?: number
  debounceMs?: number
  persistToUrl?: boolean
  className?: string
}

export function ResourceSearch({
  resources,
  pageSize = 20,
  debounceMs = 200,
  persistToUrl = true,
  className,
}: ResourceSearchProps) {
  const items = mapResourcesIndexToSearchItems(resources)
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
            className={`flex items-center justify-between rounded px-1 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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
              ↗
            </span>
          </a>
        )}
        emptyState={<div className="text-gray-300">No resources found.</div>}
        loadingState={<div className="text-xs text-gray-400">Searching resources…</div>}
      />
    </div>
  )
}

export default ResourceSearch