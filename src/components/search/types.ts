export type SearchItem = {
  id: string
  title: string
  subtitle?: string
  href: string
  tokens: string[]
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

export type DataSourceList = {
  list: SearchItem[]
}

export type DataSourceQuery = {
  query: (params: SearchParams) => Promise<SearchResult>
}

export type SearchDataSource = DataSourceList | DataSourceQuery
