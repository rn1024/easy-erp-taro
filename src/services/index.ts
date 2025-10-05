import type { ApiResponse } from '@/types'

export { ApiService } from './api'

export * from './account'
export * from './auth'
export * from './basic'
export * from './common'
export * from './delivery'
export * from './exports'
export * from './financial'
export * from './forwarders'
export * from './inventory'
export * from './logs'
export * from './packaging'
export * from './product-items'
export * from './products'
export * from './purchase'
export * from './roles'
export * from './shops'
export * from './suppliers'
export * from './supply'
export * from './tasks'
export * from './types'

export const APIUtils = {
  buildQuery: (params: Record<string, unknown>): string => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  },

  handleError: (error: unknown): string => {
    if (error && typeof error === 'object' && 'msg' in error) {
      return String((error as { msg: unknown }).msg)
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message)
    }
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response: unknown }).response
      if (response && typeof response === 'object' && 'data' in response) {
        const data = (response as { data: unknown }).data
        if (data && typeof data === 'object' && 'msg' in data) {
          return String((data as { msg: unknown }).msg)
        }
      }
    }
    if (typeof error === 'string') {
      return error
    }
    return '操作失败，请重试'
  },

  formatResponse: <T>(response: unknown): ApiResponse<T> => {
    const obj = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
    return {
      code: (obj.code as number) || (obj.success === false ? 1 : 0),
      msg: String(obj.msg || obj.message || ''),
      data: (obj.data as T) ?? (null as T)
    }
  },

  isSuccess: (response: unknown): response is ApiResponse<unknown> => {
    return Boolean(response && typeof response === 'object' && 'code' in response && (response as { code: unknown }).code === 0)
  },

  extractData: <T>(response: ApiResponse<T>): T | null => {
    return response.code === 0 ? response.data : null
  }
}

export type { ApiResponse } from '@/types'
export type { PaginatedResponse } from '@/types'
export type {
  AuthUser,
  LoginForm,
  UserRole,
  Permission,
  Product,
  FinishedInventory,
  SpareInventory,
  PackageTask,
  ShipmentTask,
  PackageStatus,
  ShipmentStatus
} from '@/types/admin'
