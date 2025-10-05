import { useCallback, useEffect, useRef, useState } from 'react'
import Taro from '@tarojs/taro'

export type ListFetcherParams<TFilters extends Record<string, unknown> = Record<string, unknown>> = TFilters & {
  page: number
  pageSize: number
  refresh?: boolean
}

export interface UseListQueryTransformResult<TItem, TExtra = unknown> {
  items: TItem[]
  total: number
  page: number
  pageSize?: number
  hasMore: boolean
  extra?: TExtra
}

export interface UseListQueryOptions<TItem, TResponse, TFilters extends Record<string, unknown> = Record<string, unknown>, TExtra = unknown> {
  fetcher: (params: ListFetcherParams<TFilters>) => Promise<TResponse>
  transform: (
    response: TResponse,
    previousItems: TItem[],
    params: ListFetcherParams<TFilters>
  ) => UseListQueryTransformResult<TItem, TExtra>
  initialItems?: TItem[]
  initialFilters?: TFilters
  pageSize?: number
  autoFetch?: boolean
  toastError?: boolean
  onError?: (error: unknown) => void
}

export interface UseListQueryReturn<TItem, TFilters, TExtra = unknown> {
  items: TItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  extra?: TExtra
  loading: boolean
  refreshing: boolean
  loadingMore: boolean
  error: string | null
  filters: TFilters
  load: (options?: { append?: boolean; page?: number; filtersOverride?: TFilters }) => Promise<void>
  refresh: (options?: { filtersOverride?: TFilters }) => Promise<void>
  loadMore: () => Promise<void>
  setFilters: (
    updater: TFilters | ((prev: TFilters) => TFilters),
    options?: { refresh?: boolean; resetPage?: boolean }
  ) => void
  reset: () => void
  setPageSize: (size: number) => void
  setItems: React.Dispatch<React.SetStateAction<TItem[]>>
}

function useListQuery<TItem, TResponse, TFilters extends Record<string, unknown> = Record<string, unknown>, TExtra = unknown>(
  options: UseListQueryOptions<TItem, TResponse, TFilters, TExtra>
): UseListQueryReturn<TItem, TFilters, TExtra> {
  const {
    fetcher,
    transform,
    initialItems,
    initialFilters,
    pageSize: defaultPageSize = 10,
    autoFetch = true,
    toastError = true,
    onError
  } = options

  const [items, setItems] = useState<TItem[]>(initialItems ?? [])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [hasMore, setHasMore] = useState(true)
  const [extra, setExtra] = useState<TExtra | undefined>(undefined)
  const [filters, setFiltersState] = useState<TFilters>(
    () => (initialFilters ? { ...initialFilters } : ({} as TFilters))
  )
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasMountedRef = useRef(false)
  const filtersRef = useRef(filters)
  const itemsRef = useRef(items)
  const pageRef = useRef(page)
  const pageSizeRef = useRef(pageSize)
  const fetcherRef = useRef(fetcher)
  const transformRef = useRef(transform)
  const onErrorRef = useRef(onError)
  const toastErrorRef = useRef(toastError)

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    pageRef.current = page
  }, [page])

  useEffect(() => {
    pageSizeRef.current = pageSize
  }, [pageSize])

  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  useEffect(() => {
    transformRef.current = transform
  }, [transform])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    toastErrorRef.current = toastError
  }, [toastError])

  const load = useCallback(async (
    loadOptions: { append?: boolean; page?: number; filtersOverride?: TFilters } = {}
  ) => {
    const { append = false, page: overridePage, filtersOverride } = loadOptions
    const targetFilters = filtersOverride ?? filtersRef.current
    const currentPage = pageRef.current
    const targetPage = overridePage ?? (append ? currentPage + 1 : 1)
    const currentPageSize = pageSizeRef.current

    const isRefresh = !append || targetPage === 1

    if (append) {
      setLoadingMore(true)
    } else if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError(null)

    try {
      const params = {
        ...(targetFilters as TFilters),
        page: targetPage,
        pageSize: currentPageSize,
        refresh: isRefresh
      } as ListFetcherParams<TFilters>

      const response = await fetcherRef.current(params)
      const previousItems = append ? itemsRef.current : []
      const result = transformRef.current(response, previousItems, params)

      setItems(result.items)
      itemsRef.current = result.items

      setTotal(result.total)
      const resolvedPage = result.page ?? targetPage
      setPage(resolvedPage)
      pageRef.current = resolvedPage

      setHasMore(result.hasMore)

      if (result.pageSize) {
        setPageSize(result.pageSize)
        pageSizeRef.current = result.pageSize
      }

      if (result.extra !== undefined) {
        setExtra(result.extra)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '加载失败'
      setError(message)

      if (toastErrorRef.current) {
        Taro.showToast({ title: message, icon: 'error' })
      }

      if (onErrorRef.current) {
        onErrorRef.current(err)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLoadingMore(false)
    }
  }, [])

  const refresh = useCallback(async (
    refreshOptions: { filtersOverride?: TFilters } = {}
  ) => {
    await load({ append: false, page: 1, filtersOverride: refreshOptions.filtersOverride })
  }, [load])

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) {
      return
    }
    await load({ append: true })
  }, [hasMore, load, loadingMore])

  const reset = useCallback(() => {
    setItems(initialItems ?? [])
    setTotal(0)
    setPage(1)
    setHasMore(true)
    setExtra(undefined)
    setError(null)
  }, [initialItems])

  const setFilters = useCallback((
    updater: TFilters | ((prev: TFilters) => TFilters),
    updateOptions: { refresh?: boolean; resetPage?: boolean } = {}
  ) => {
    const { refresh: shouldRefresh = true, resetPage: shouldResetPage = true } = updateOptions

    setFiltersState(prev => {
      const next = typeof updater === 'function'
        ? (updater as (value: TFilters) => TFilters)(prev)
        : updater

      if (shouldResetPage) {
        setPage(1)
        pageRef.current = 1
      }

      if (shouldRefresh) {
        load({ append: false, page: shouldResetPage ? 1 : pageRef.current, filtersOverride: next })
      }

      return next
    })
  }, [load])

  useEffect(() => {
    if (!autoFetch) {
      return
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      load({ append: false, page: 1 })
    }
  }, [autoFetch, load])

  return {
    items,
    total,
    page,
    pageSize,
    hasMore,
    extra,
    loading,
    refreshing,
    loadingMore,
    error,
    filters,
    load,
    refresh,
    loadMore,
    setFilters,
    reset,
    setPageSize,
    setItems
  }
}

export default useListQuery
