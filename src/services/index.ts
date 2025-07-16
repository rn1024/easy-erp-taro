// API服务统一导出入口

// 基础API服务
export { ApiService } from './api'

// 库存相关API  
export { InventoryAPI, FinishedInventoryAPI, SpareInventoryAPI } from './inventory'

// 任务相关API
export { TasksAPI, PackageTaskAPI, ShipmentTaskAPI } from './tasks'

// 产品和查询相关API
export { ProductsAPI, ProductAPI, QueryAPI } from './products'

// 导入用于统一API对象
import { ApiService } from './api'
import { InventoryAPI } from './inventory'
import { TasksAPI } from './tasks'
import { ProductsAPI } from './products'
import type { ApiResponse, PaginatedResponse } from '@/types'

// 统一的API对象，方便在组件中使用
export const API = {
  // 基础服务
  base: ApiService,
  
  // 库存管理
  inventory: InventoryAPI,
  
  // 任务管理
  tasks: TasksAPI,
  
  // 产品管理
  products: ProductsAPI,
}

// 类型导出
export type {
  // 基础类型
  ApiResponse,
  PaginatedResponse,
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
  ShipmentStatus,
} from '@/types/admin'

// 常用工具方法
export const APIUtils = {
  // 构建查询参数
  buildQuery: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  },

  // 处理API错误
  handleError: (error: any): string => {
    if (error?.message) {
      return error.message
    }
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    if (typeof error === 'string') {
      return error
    }
    return '操作失败，请重试'
  },

  // 格式化响应数据
  formatResponse: <T>(response: any): ApiResponse<T> => {
    return {
      success: response?.success || false,
      data: response?.data || null,
      message: response?.message || '',
      code: response?.code || 0
    }
  },

  // 检查是否为成功响应
  isSuccess: (response: any): boolean => {
    return response?.success === true
  },

  // 提取响应数据
  extractData: <T>(response: ApiResponse<T>): T | null => {
    return APIUtils.isSuccess(response) ? response.data : null
  }
} 