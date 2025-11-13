"use client"

import React, { useMemo, useState } from "react"
import type { DataSourceList, SearchItem } from "./types"
import { filterItems } from "./filter"
import { useDebouncedValue } from "./useDebouncedValue"

export type HeadlessSearchProps = {
  dataSource: DataSourceList
  pageSize?: number
  debounceMs?: number
  persistToUrl?: boolean // reserved for phase 4; currently unused
  renderItem: (item: SearchItem, state: { index: number; active: boolean }) => React.ReactNode
  emptyState?: React.ReactNode
  loadingState?: React.ReactNode
  filters?: Record<string, string | string[]>
}

export function HeadlessSearch({
  dataSource,
  pageSize = 20,
  debounceMs = 200,
  // persistToUrl, // reserved for future phase
  renderItem,
  emptyState = <div>No results</div>,
  loadingState = null,
  filters,
}: HeadlessSearchProps) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  const debouncedQ = useDebouncedValue(q, debounceMs)

  const filtered = useMemo(() => {
    const next = filterItems(dataSource.list, debouncedQ, filters)
    // reset page if query changed and current page is out of bounds
    if (page > 1 && (page - 1) * pageSize >= next.length) {
      setPage(1)
    }
    return next
  }, [dataSource.list, debouncedQ, filters, page, pageSize])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const onPrev = () => setPage((p) => Math.max(1, p - 1))
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1))

  const showLoading = q !== debouncedQ && loadingState !== null

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor="search-input" className="sr-only">
          Search
        </label>
        <input
          id="search-input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPage(1)
          }}
          placeholder="Search..."
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>

      {showLoading ? (
        loadingState
      ) : (
        <div aria-live="polite" className="text-xs text-muted-foreground">
          {total} result{total === 1 ? "" : "s"}
        </div>
      )}

      <div role="list" className="flex flex-col divide-y">
        {pageItems.length === 0 ? (
          <div role="status">{emptyState}</div>
        ) : (
          pageItems.map((item, idx) => (
            <div role="listitem" key={item.id} className="py-2">
              {renderItem(item, { index: start + idx, active: false })}
            </div>
          ))
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          aria-label="Previous page"
        >
          Prev
        </button>
        <div className="text-xs">
          Page {page} / {totalPages}
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default HeadlessSearch
