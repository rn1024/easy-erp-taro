// API服务统一导出入口

import type { ApiResponse } from '@/types'

// 基础API服务
// 导入用于统一API对象
import { ApiService } from './api'
import { InventoryAPI } from './inventory'
import { TasksAPI } from './tasks'
import { getProducts, getProductById, searchProductsBySku } from './products'

export { ApiService } from './api'

// 认证相关API
export { AuthAPI } from './auth'

// 库存相关API  
export { InventoryAPI, FinishedInventoryAPI, SpareInventoryAPI } from './inventory'

// 任务相关API
export { TasksAPI, WarehouseTaskAPI, PackageTaskAPI, ShipmentTaskAPI } from './tasks'

// 产品和查询相关API
export { getProducts, getProductById, searchProductsBySku } from './products'

// 基础数据API
export { BasicDataAPI, type Shop, type ProductCategory } from './basic'

// 统一的API对象，方便在组件中使用
export const API = {
  // 基础服务
  base: ApiService,
  
  // 库存管理
  inventory: InventoryAPI,
  
  // 任务管理
  tasks: TasksAPI,
  
  // 产品管理
  products: {
    getList: getProducts,
    getById: getProductById,
    searchBySku: searchProductsBySku
  }
}

// 类型导出
export type {
  // 基础类型
  ApiResponse,
  PaginatedResponse
} from '@/types'

export type {
  // 业务类型
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

// 常用工具方法
export const APIUtils = {
  // 构建查询参数
  buildQuery: (params: Record<string, unknown>): string => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  },

  // 处理API错误 - 适配easy-erp-web格式
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

  // 格式化响应数据 - 适配easy-erp-web格式
  formatResponse: <T>(response: unknown): ApiResponse<T> => {
    const obj = response && typeof response === 'object' ? response as Record<string, unknown> : {}
    return {
      code: (obj.code as number) || (obj.success === false ? 1 : 0),
      msg: String(obj.msg || obj.message || ''),
      data: (obj.data as T) ?? null as T
    }
  },

  // 检查是否为成功响应 - 适配easy-erp-web格式
  isSuccess: (response: unknown): response is ApiResponse<unknown> => {
    return Boolean(response && typeof response === 'object' && 'code' in response && (response as { code: unknown }).code === 0)
  },

  // 提取响应数据
  extractData: <T>(response: ApiResponse<T>): T | null => {
    return response.code === 0 ? response.data : null
  }
}