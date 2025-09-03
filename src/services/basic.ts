import type { ApiResponse } from '@/types'
import { ApiService } from './api'

// 店铺数据类型
export interface Shop {
  id: string
  nickname: string
  description?: string
  status: string
  createdAt: string
  updatedAt: string
}

// 产品分类数据类型
export interface ProductCategory {
  id: string
  name: string
  description?: string
  parentId?: string
  status: string
  createdAt: string
  updatedAt: string
}

// 基础数据API服务
export class BasicDataAPI {
  // 获取店铺列表
  static async getShops(): Promise<ApiResponse<Shop[]>> {
    return ApiService.get('/shops')
  }

  // 获取产品分类列表
  static async getProductCategories(params?: {
    parentId?: string
    status?: string
  }): Promise<ApiResponse<ProductCategory[]>> {
    return ApiService.get('/product-categories', params)
  }

  // 获取店铺详情
  static async getShopDetail(id: string): Promise<ApiResponse<Shop>> {
    return ApiService.get(`/shops/${id}`)
  }

  // 获取产品分类详情
  static async getCategoryDetail(id: string): Promise<ApiResponse<ProductCategory>> {
    return ApiService.get(`/product-categories/${id}`)
  }
} 