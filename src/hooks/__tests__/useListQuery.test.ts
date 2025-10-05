import { renderHook, act, waitFor } from '@testing-library/react'
import Taro from '@tarojs/taro'
import useListQuery from '../useListQuery'

jest.mock('@tarojs/taro', () => ({
  showToast: jest.fn()
}))

interface TestItem {
  id: string
  name: string
}

interface TestResponse {
  list: TestItem[]
  total: number
  totalPages: number
  page: number
}

interface TestFilters extends Record<string, unknown> {
  search?: string
  category?: string
}

const createMockFetcher = (data: TestItem[], delay = 0) =>
  jest.fn().mockImplementation(async (params) => {
    if (delay) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    const filtered = data.filter(item => {
      if (params.search && !item.name.includes(params.search)) {
        return false
      }
      return true
    })
    
    const total = filtered.length
    const pageSize = params.pageSize || 10
    const totalPages = Math.ceil(total / pageSize)
    const start = (params.page - 1) * pageSize
    const list = filtered.slice(start, start + pageSize)
    
    return {
      list,
      total,
      totalPages,
      page: params.page
    }
  })

const mockTransform = jest.fn().mockImplementation((response, previousItems, params) => ({
  items: params.refresh ? response.list : [...previousItems, ...response.list],
  total: response.total,
  page: response.page,
  pageSize: params.pageSize,
  hasMore: response.page < response.totalPages
}))

describe('useListQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('初始化', () => {
    it('应该使用初始值正确初始化', () => {
      const initialItems = [{ id: '1', name: 'Test' }]
      const initialFilters = { search: 'test' }
      
      const { result } = renderHook(() =>
        useListQuery({
          fetcher: createMockFetcher([]),
          transform: mockTransform,
          initialItems,
          initialFilters,
          pageSize: 20,
          autoFetch: false
        })
      )

      expect(result.current.items).toEqual(initialItems)
      expect(result.current.filters).toEqual(initialFilters)
      expect(result.current.pageSize).toBe(20)
      expect(result.current.page).toBe(1)
      expect(result.current.total).toBe(0)
      expect(result.current.loading).toBe(false)
    })

    it('应该在autoFetch为true时自动获取数据', async () => {
      const testData = [{ id: '1', name: 'Test Item' }]
      const fetcher = createMockFetcher(testData)

      renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          autoFetch: true
        })
      )

      await waitFor(() => {
        expect(fetcher).toHaveBeenCalledWith({
          page: 1,
          pageSize: 10,
          refresh: true
        })
      })
    })
  })

  describe('数据加载', () => {
    it('应该成功加载数据', async () => {
      const testData = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' }
      ]
      const fetcher = createMockFetcher(testData)

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          autoFetch: false
        })
      )

      await act(async () => {
        await result.current.load()
      })

      expect(result.current.items).toEqual(testData)
      expect(result.current.total).toBe(2)
      expect(result.current.loading).toBe(false)
    })

    it('应该处理分页加载', async () => {
      const testData = Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Item ${i + 1}`
      }))
      const fetcher = createMockFetcher(testData)

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          pageSize: 10,
          autoFetch: false
        })
      )

      await act(async () => {
        await result.current.load()
      })

      expect(result.current.items).toHaveLength(10)
      expect(result.current.hasMore).toBe(true)

      await act(async () => {
        await result.current.loadMore()
      })

      expect(result.current.items).toHaveLength(20)
      expect(result.current.page).toBe(2)
    })

    it('应该在错误时显示提示并调用错误回调', async () => {
      const error = new Error('网络错误')
      const fetcher = jest.fn().mockRejectedValue(error)
      const onError = jest.fn()

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          autoFetch: false,
          onError
        })
      )

      await act(async () => {
        await result.current.load()
      })

      expect(result.current.error).toBe('网络错误')
      expect(Taro.showToast).toHaveBeenCalledWith({
        title: '网络错误',
        icon: 'error'
      })
      expect(onError).toHaveBeenCalledWith(error)
    })

    it('应该在toastError为false时不显示错误提示', async () => {
      const fetcher = jest.fn().mockRejectedValue(new Error('网络错误'))

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          autoFetch: false,
          toastError: false
        })
      )

      await act(async () => {
        await result.current.load()
      })

      expect(Taro.showToast).not.toHaveBeenCalled()
    })
  })

  describe('过滤器', () => {
    it('应该根据过滤器更新数据', async () => {
      const testData = [
        { id: '1', name: 'Apple' },
        { id: '2', name: 'Banana' },
        { id: '3', name: 'Cherry' }
      ]
      const fetcher = createMockFetcher(testData)

      const { result } = renderHook(() =>
        useListQuery<TestItem, TestResponse, TestFilters>({
          fetcher,
          transform: mockTransform,
          autoFetch: false
        })
      )

      await act(async () => {
        result.current.setFilters({ search: 'Apple' })
      })

      await waitFor(() => {
        expect(fetcher).toHaveBeenLastCalledWith({
          search: 'Apple',
          page: 1,
          pageSize: 10,
          refresh: true
        })
      })
    })

    it('应该在resetPage为false时保持当前页码', async () => {
      const testData = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Item ${i + 1}`
      }))
      const fetcher = createMockFetcher(testData)

      const { result } = renderHook(() =>
        useListQuery<TestItem, TestResponse, TestFilters>({
          fetcher,
          transform: mockTransform,
          autoFetch: false
        })
      )

      await act(async () => {
        await result.current.load({ page: 2 })
      })

      expect(result.current.page).toBe(2)

      await act(async () => {
        result.current.setFilters({ search: 'test' }, { resetPage: false })
      })

      await waitFor(() => {
        expect(fetcher).toHaveBeenLastCalledWith({
          search: 'test',
          page: 2,
          pageSize: 10,
          refresh: true
        })
      })
    })
  })

  describe('刷新和重置', () => {
    it('应该刷新数据', async () => {
      const testData = [{ id: '1', name: 'Test' }]
      const fetcher = createMockFetcher(testData)

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          autoFetch: false
        })
      )

      await act(async () => {
        await result.current.refresh()
      })

      expect(fetcher).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        refresh: true
      })
      expect(result.current.refreshing).toBe(false)
    })

    it('应该重置到初始状态', () => {
      const initialItems = [{ id: 'init', name: 'Initial' }]
      
      const { result } = renderHook(() =>
        useListQuery({
          fetcher: createMockFetcher([]),
          transform: mockTransform,
          initialItems,
          autoFetch: false
        })
      )

      act(() => {
        result.current.setItems([{ id: 'new', name: 'New' }])
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.items).toEqual(initialItems)
      expect(result.current.total).toBe(0)
      expect(result.current.page).toBe(1)
    })
  })

  describe('页面大小管理', () => {
    it('应该更新页面大小', () => {
      const { result } = renderHook(() =>
        useListQuery({
          fetcher: createMockFetcher([]),
          transform: mockTransform,
          autoFetch: false
        })
      )

      act(() => {
        result.current.setPageSize(20)
      })

      expect(result.current.pageSize).toBe(20)
    })
  })

  describe('加载状态', () => {
    it('应该正确管理loading状态', async () => {
      const fetcher = createMockFetcher([], 100) // 100ms延迟

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          autoFetch: false
        })
      )

      const loadPromise = act(async () => {
        await result.current.load()
      })

      expect(result.current.loading).toBe(true)

      await loadPromise

      expect(result.current.loading).toBe(false)
    })

    it('应该正确管理refreshing状态', async () => {
      const fetcher = createMockFetcher([], 100)

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          autoFetch: false
        })
      )

      const refreshPromise = act(async () => {
        await result.current.refresh()
      })

      expect(result.current.refreshing).toBe(true)

      await refreshPromise

      expect(result.current.refreshing).toBe(false)
    })

    it('应该正确管理loadingMore状态', async () => {
      const testData = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Item ${i + 1}`
      }))
      const fetcher = createMockFetcher(testData, 100)

      const { result } = renderHook(() =>
        useListQuery({
          fetcher,
          transform: mockTransform,
          pageSize: 10,
          autoFetch: false
        })
      )

      await act(async () => {
        await result.current.load()
      })

      const loadMorePromise = act(async () => {
        await result.current.loadMore()
      })

      expect(result.current.loadingMore).toBe(true)

      await loadMorePromise

      expect(result.current.loadingMore).toBe(false)
    })
  })
})