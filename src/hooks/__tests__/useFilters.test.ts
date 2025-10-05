import { renderHook, act } from '@testing-library/react'
import useFilters from '../useFilters'

describe('useFilters', () => {
  describe('单选过滤器', () => {
    it('应该初始化为默认值', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: { defaultValue: 'electronics' },
            status: { defaultValue: null }
          }
        })
      )

      expect(result.current.values).toEqual({
        category: 'electronics',
        status: null
      })
    })

    it('应该设置单个值', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: {},
            status: {}
          }
        })
      )

      act(() => {
        result.current.setValue('category', 'books')
      })

      expect(result.current.values.category).toBe('books')
    })

    it('应该切换单个值', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: {}
          }
        })
      )

      act(() => {
        result.current.toggleValue('category', 'books')
      })
      expect(result.current.values.category).toBe('books')

      act(() => {
        result.current.toggleValue('category', 'books')
      })
      expect(result.current.values.category).toBe(null)
    })

    it('应该检查值是否激活', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: { defaultValue: 'electronics' }
          }
        })
      )

      expect(result.current.isActive('category', 'electronics')).toBe(true)
      expect(result.current.isActive('category', 'books')).toBe(false)
    })
  })

  describe('多选过滤器', () => {
    it('应该初始化为空数组', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            tags: { multiple: true },
            categories: { multiple: true, defaultValue: ['a', 'b'] }
          }
        })
      )

      expect(result.current.values).toEqual({
        tags: [],
        categories: ['a', 'b']
      })
    })

    it('应该设置多个值', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            tags: { multiple: true }
          }
        })
      )

      act(() => {
        result.current.setValue('tags', ['react', 'typescript'])
      })

      expect(result.current.values.tags).toEqual(['react', 'typescript'])
    })

    it('应该切换多个值', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            tags: { multiple: true }
          }
        })
      )

      act(() => {
        result.current.toggleValue('tags', 'react')
      })
      expect(result.current.values.tags).toEqual(['react'])

      act(() => {
        result.current.toggleValue('tags', 'typescript')
      })
      expect(result.current.values.tags).toEqual(['react', 'typescript'])

      act(() => {
        result.current.toggleValue('tags', 'react')
      })
      expect(result.current.values.tags).toEqual(['typescript'])
    })

    it('应该检查多个值中是否包含指定值', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            tags: { multiple: true, defaultValue: ['react', 'typescript'] }
          }
        })
      )

      expect(result.current.isActive('tags', 'react')).toBe(true)
      expect(result.current.isActive('tags', 'vue')).toBe(false)
    })
  })

  describe('重置功能', () => {
    it('应该重置单个过滤器', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: { defaultValue: 'electronics' },
            status: { defaultValue: 'active' }
          }
        })
      )

      act(() => {
        result.current.setValue('category', 'books')
      })

      act(() => {
        result.current.reset('category')
      })

      expect(result.current.values.category).toBe('electronics')
      expect(result.current.values.status).toBe('active')
    })

    it('应该重置所有过滤器', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: { defaultValue: 'electronics' },
            status: { defaultValue: 'active' }
          }
        })
      )

      act(() => {
        result.current.setValue('category', 'books')
        result.current.setValue('status', 'inactive')
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.values).toEqual({
        category: 'electronics',
        status: 'active'
      })
    })

    it('应该清空所有过滤器', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: { defaultValue: 'electronics' },
            tags: { multiple: true, defaultValue: ['react'] }
          }
        })
      )

      act(() => {
        result.current.clearAll()
      })

      expect(result.current.values).toEqual({
        category: null,
        tags: []
      })
    })
  })

  describe('变化回调', () => {
    it('应该在值变化时调用回调函数', () => {
      const onChange = jest.fn()
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: {}
          },
          onChange
        })
      )

      act(() => {
        result.current.setValue('category', 'books')
      })

      expect(onChange).toHaveBeenCalledWith({
        category: 'books'
      })
    })

    it('应该在切换值时调用回调函数', () => {
      const onChange = jest.fn()
      const { result } = renderHook(() =>
        useFilters({
          config: {
            tags: { multiple: true }
          },
          onChange
        })
      )

      act(() => {
        result.current.toggleValue('tags', 'react')
      })

      expect(onChange).toHaveBeenCalledWith({
        tags: ['react']
      })
    })
  })

  describe('值规范化', () => {
    it('应该将单选过滤器的数组值规范化为单个值', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            category: {}
          }
        })
      )

      act(() => {
        result.current.setValue('category', ['books', 'electronics'])
      })

      expect(result.current.values.category).toBe('books')
    })

    it('应该将多选过滤器的字符串值规范化为数组', () => {
      const { result } = renderHook(() =>
        useFilters({
          config: {
            tags: { multiple: true }
          }
        })
      )

      act(() => {
        result.current.setValue('tags', 'react')
      })

      expect(result.current.values.tags).toEqual(['react'])
    })
  })
})