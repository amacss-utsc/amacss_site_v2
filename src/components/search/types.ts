// Contracts for the reusable search component. Keep minimal and framework-agnostic.

export type SearchItem = {
  id: string
  title: string
  subtitle?: string
  href: string // site route to navigate to when selecting this item
  tokens: string[] // keywords used for matching; include title words and aliases
  meta?: Record<string, unknown>
}

export type SearchParams = {
  q: string
  page: number
  pageSize: number
  filters?: Record<string, string | string[]>
}

export type SearchResult = {
  items: SearchItem[]
  total: number
}

// Two data input modes — list (client-side) or query (API-based). We will start with list.
export type DataSourceList = {
  list: SearchItem[]
}

export type DataSourceQuery = {
  query: (params: SearchParams) => Promise<SearchResult>
}

export type SearchDataSource = DataSourceList | DataSourceQuery
