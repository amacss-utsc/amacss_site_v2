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
        className="flex flex-col gap-4"
        renderItem={(item, state) => (
          <a
            href={item.href}
            className={`flex items-center justify-between gap-4 rounded-lg transition-colors group ${
              state.active ? "" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-neutral-200 group-hover:text-white">
                {item.title}
              </div>
              {item.subtitle && (
                <div className="truncate text-[11px] text-neutral-500">
                  {item.subtitle}
                </div>
              )}
            </div>
            <span
              aria-hidden
              className="text-neutral-500 group-hover:text-neutral-300 transition-colors"
            >
              ↗
            </span>
          </a>
        )}
        emptyState={<div className="text-neutral-500">No resources found.</div>}
    loadingState={<div className="text-[11px] text-neutral-500">Searching resources…</div>}
    inputClassName="w-full rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        listClassName="flex flex-col divide-y divide-neutral-800 rounded-lg border border-neutral-800 bg-neutral-950"
        optionClassName="py-2 px-3 outline-none rounded-none"
        activeOptionClassName="bg-neutral-800"
        countClassName="text-xs text-neutral-500"
        paginationClassName="mt-2 flex items-center justify-between gap-2 text-xs text-neutral-500"
  buttonClassName="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs hover:bg-neutral-800 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )
}

export default ResourceSearch