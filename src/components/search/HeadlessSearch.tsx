"use client"

import React, { useMemo, useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { DataSourceList, SearchItem } from "./types"
import { filterItems } from "./filter"
import { useDebouncedValue } from "./useDebouncedValue"

export type HeadlessSearchProps = {
  dataSource: DataSourceList
  pageSize?: number
  debounceMs?: number
  persistToUrl?: boolean
  renderItem: (item: SearchItem, state: { index: number; active: boolean }) => React.ReactNode
  emptyState?: React.ReactNode
  loadingState?: React.ReactNode
  filters?: Record<string, string | string[]>
}

export function HeadlessSearch({
  dataSource,
  pageSize = 20,
  debounceMs = 200,
  persistToUrl = false,
  renderItem,
  emptyState = <div>No results</div>,
  loadingState = null,
  filters,
}: HeadlessSearchProps) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const debouncedQ = useDebouncedValue(q, debounceMs)

  const filtered = useMemo(() => {
    const next = filterItems(dataSource.list, debouncedQ, filters)
    if (page > 1 && (page - 1) * pageSize >= next.length) {
      setPage(1)
    }
    return next
  }, [dataSource.list, debouncedQ, filters, page, pageSize])

  // Clear active selection when page or (debounced) query changes
  useEffect(() => {
    setActiveIndex(null)
  }, [debouncedQ, page])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const onPrev = () => setPage((p) => Math.max(1, p - 1))
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1))

  const showLoading = q !== debouncedQ && loadingState !== null

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const hasInitializedFromUrlRef = useRef(false)

  // Initial URL param hydration (only if persistToUrl true)
  useEffect(() => {
    if (!persistToUrl) return
    if (hasInitializedFromUrlRef.current) return
    hasInitializedFromUrlRef.current = true
    const initialQ = searchParams.get("q") ?? ""
    const rawPage = searchParams.get("page")
    const parsedPage = rawPage ? parseInt(rawPage, 10) : 1
    const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
    setQ(initialQ)
    setPage(safePage)
  }, [persistToUrl, searchParams])

  // Write state changes back to URL (using debounced query for less churn)
  useEffect(() => {
    if (!persistToUrl) return
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedQ) {
      params.set("q", debouncedQ)
    } else {
      params.delete("q")
    }
    if (page > 1) {
      params.set("page", String(page))
    } else {
      params.delete("page")
    }
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [debouncedQ, page, persistToUrl, router, pathname, searchParams])

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!pageItems.length) return
      setActiveIndex((prev) => {
        if (prev === null) return 0
        if (prev + 1 < pageItems.length) return prev + 1
        return prev
      })
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!pageItems.length) return
      setActiveIndex((prev) => {
        if (prev === null) return pageItems.length - 1
        if (prev > 0) return prev - 1
        return prev
      })
      return
    }
    if (e.key === "Enter" && activeIndex !== null) {
      const item = pageItems[activeIndex]
      if (item) {
        window.location.assign(item.href)
      }
      return
    }
    if (e.key === "Escape") {
      if (activeIndex !== null) {
        setActiveIndex(null)
        inputRef.current?.focus()
        return
      }
      if (q) {
        setQ("")
        setPage(1)
      }
    }
  }

  return (
    <div className="flex flex-col gap-3" role="search" onKeyDown={handleKeyDown}>
      <div>
        <label htmlFor="search-input" className="sr-only">
          Search
        </label>
        <input
          id="search-input"
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPage(1)
          }}
          placeholder="Search..."
          className="w-full rounded border px-3 py-2 text-sm"
          aria-controls="search-results"
          aria-describedby="search-count"
        />
      </div>

      {showLoading ? (
        loadingState
      ) : (
        <div id="search-count" aria-live="polite" className="text-xs text-gray-400">
          {total} result{total === 1 ? "" : "s"}
        </div>
      )}

      <div
        id="search-results"
        role="listbox"
        aria-label="Search results"
        className="flex flex-col divide-y"
      >
        {pageItems.length === 0 ? (
          <div role="status" className="text-gray-300">{emptyState}</div>
        ) : (
          pageItems.map((item, idx) => (
            <div
              key={item.id}
              role="option"
              aria-selected={activeIndex === idx}
              tabIndex={activeIndex === idx ? 0 : -1}
              onFocus={() => setActiveIndex(idx)}
              className={`py-2 text-gray-100 outline-none ${
                activeIndex === idx ? "bg-gray-800" : ""
              }`}
            >
              {renderItem(item, { index: start + idx, active: activeIndex === idx })}
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
