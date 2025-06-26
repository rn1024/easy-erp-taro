import { useState, useCallback, useRef, useEffect } from 'react'
import Taro from '@tarojs/taro'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncOptions {
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  errorDuration?: number
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

/**
 * 异步操作管理Hook
 * 提供加载状态、错误处理、自动提示等功能
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const {
    showLoading = true,
    loadingText = '加载中...',
    showError = true,
    errorDuration = 2000,
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const mountedRef = useRef(true)
  const loadingToastRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    if (showLoading) {
      Taro.showLoading({
        title: loadingText,
        mask: true
      })
      loadingToastRef.current = true
    }

    try {
      const result = await asyncFunction(...args)

      if (mountedRef.current) {
        setState({
          data: result,
          loading: false,
          error: null
        })

        if (onSuccess) {
          onSuccess(result)
        }
      }

      return result
    } catch (error) {
      const err = error as Error

      if (mountedRef.current) {
        setState({
          data: null,
          loading: false,
          error: err
        })

        if (showError) {
          Taro.showToast({
            title: err.message || '操作失败',
            icon: 'none',
            duration: errorDuration
          })
        }

        if (onError) {
          onError(err)
        }
      }

      throw err
    } finally {
      if (showLoading && loadingToastRef.current) {
        Taro.hideLoading()
        loadingToastRef.current = false
      }
    }
  }, [asyncFunction, showLoading, loadingText, showError, errorDuration, onSuccess, onError])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}

/**
 * 带防抖的异步Hook
 */
export function useAsyncDebounce<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  delay: number = 500,
  options: UseAsyncOptions = {}
) {
  const timeoutRef = useRef<any>(null)
  const async = useAsync(asyncFunction, options)

  const debouncedExecute = useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    return new Promise<T>((resolve, reject) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          const result = await async.execute(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }, [async.execute, delay])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    ...async,
    execute: debouncedExecute
  }
}

/**
 * 带重试的异步Hook
 */
export function useAsyncRetry<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000,
  options: UseAsyncOptions = {}
) {
  const async = useAsync(asyncFunction, options)

  const executeWithRetry = useCallback(async (...args: any[]) => {
    let lastError: Error | null = null

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await async.execute(...args)
        return result
      } catch (error) {
        lastError = error as Error

        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)))
        }
      }
    }

    throw lastError
  }, [async.execute, maxRetries, retryDelay])

  return {
    ...async,
    execute: executeWithRetry
  }
}
