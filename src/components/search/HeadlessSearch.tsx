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
  className?: string
  inputClassName?: string
  countClassName?: string
  listClassName?: string
  optionClassName?: string
  activeOptionClassName?: string
  paginationClassName?: string
  buttonClassName?: string
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
  className,
  inputClassName,
  countClassName,
  listClassName,
  optionClassName,
  activeOptionClassName,
  paginationClassName,
  buttonClassName,
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

  const rootCls = className ?? "flex flex-col gap-4"
  const inputCls = inputClassName ?? "w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-500"
  const countCls = countClassName ?? "text-xs text-neutral-500"
  const listCls = listClassName ?? "flex flex-col divide-y divide-neutral-800 rounded-md border border-neutral-800 bg-neutral-900"
  const optBase = optionClassName ?? "py-2 px-3 text-sm text-neutral-300 focus:outline-none"
  const optActive = activeOptionClassName ?? "bg-neutral-800 text-white"
  const paginationCls = paginationClassName ?? "mt-3 flex items-center justify-between gap-2 text-xs text-neutral-400"
  const buttonCls = buttonClassName ?? "rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className={rootCls} role="search" onKeyDown={handleKeyDown}>
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
          className={inputCls}
          aria-controls="search-results"
          aria-describedby="search-count"
        />
      </div>

      {showLoading ? (
        loadingState
      ) : (
        <div id="search-count" aria-live="polite" className={countCls}>
          {total} result{total === 1 ? "" : "s"}
        </div>
      )}

      <div
        id="search-results"
        role="listbox"
        aria-label="Search results"
        className={listCls}
      >
        {pageItems.length === 0 ? (
          <div role="status" className="p-4 text-neutral-400">{emptyState}</div>
        ) : (
          pageItems.map((item, idx) => (
            <div
              key={item.id}
              role="option"
              aria-selected={activeIndex === idx}
              tabIndex={activeIndex === idx ? 0 : -1}
              onFocus={() => setActiveIndex(idx)}
              className={`${optBase} ${activeIndex === idx ? optActive : ""}`}
            >
              {renderItem(item, { index: start + idx, active: activeIndex === idx })}
            </div>
          ))
        )}
      </div>

      <div className={paginationCls}>
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className={buttonCls}
          aria-label="Previous page"
        >
          Prev
        </button>
        <div className="text-xs text-neutral-500">
          Page {page} / {totalPages}
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className={buttonCls}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default HeadlessSearch
