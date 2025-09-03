import type { FinishedInventory, SpareInventory } from '@/types/admin'
import type { ApiResponse, PaginatedResponse } from '@/types'
import { ApiService } from './api'

// 成品库存API
export class FinishedInventoryAPI {
  // 获取成品库存列表
  static async getList(params: {
    page?: number
    pageSize?: number
    shop?: string
    category?: string
    keyword?: string
  } = {}): Promise<ApiResponse<PaginatedResponse<FinishedInventory>>> {
    return ApiService.get('/finished-inventory', params)
  }

  // 获取成品库存详情
  static async getDetail(id: string): Promise<ApiResponse<FinishedInventory>> {
    return ApiService.get(`/finished-inventory/${id}`)
  }

  // 新增成品库存
  static async create(data: Omit<FinishedInventory, 'id'>): Promise<ApiResponse<FinishedInventory>> {
    return ApiService.post('/finished-inventory', data)
  }

  // 更新成品库存
  static async update(id: string, data: Partial<FinishedInventory>): Promise<ApiResponse<FinishedInventory>> {
    return ApiService.put(`/finished-inventory/${id}`, data)
  }

  // 删除成品库存
  static async delete(id: string): Promise<ApiResponse<boolean>> {
    return ApiService.delete(`/finished-inventory/${id}`)
  }

  // 批量删除成品库存
  static async batchDelete(ids: string[]): Promise<ApiResponse<boolean>> {
    return ApiService.post('/finished-inventory/batch-delete', { ids })
  }

  // 获取店铺列表
  static async getShops(): Promise<ApiResponse<string[]>> {
    return ApiService.get('/shops')
  }

  // 获取产品分类列表
  static async getCategories(shop?: string): Promise<ApiResponse<string[]>> {
    return ApiService.get('/product-categories', { shop })
  }

  // 获取货位列表
  static async getLocations(): Promise<ApiResponse<string[]>> {
    return ApiService.get('/finished-inventory/locations')
  }

  // 导出数据
  static async export(params: {
    shop?: string
    category?: string
    keyword?: string
  } = {}): Promise<ApiResponse<string>> {
    return ApiService.get('/finished-inventory/export', params)
  }
}

// 散件库存API
export class SpareInventoryAPI {
  // 获取散件库存列表
  static async getList(params: {
    page?: number
    pageSize?: number
    shop?: string
    category?: string
    keyword?: string
  } = {}): Promise<ApiResponse<PaginatedResponse<SpareInventory>>> {
    return ApiService.get('/spare-inventory', params)
  }

  // 获取散件库存详情
  static async getDetail(id: string): Promise<ApiResponse<SpareInventory>> {
    return ApiService.get(`/spare-inventory/${id}`)
  }

  // 新增散件库存
  static async create(data: Omit<SpareInventory, 'id'>): Promise<ApiResponse<SpareInventory>> {
    return ApiService.post('/spare-inventory', data)
  }

  // 更新散件库存
  static async update(id: string, data: Partial<SpareInventory>): Promise<ApiResponse<SpareInventory>> {
    return ApiService.put(`/spare-inventory/${id}`, data)
  }

  // 删除散件库存
  static async delete(id: string): Promise<ApiResponse<boolean>> {
    return ApiService.delete(`/spare-inventory/${id}`)
  }

  // 批量删除散件库存
  static async batchDelete(ids: string[]): Promise<ApiResponse<boolean>> {
    return ApiService.post('/spare-inventory/batch-delete', { ids })
  }

  // 获取配件类型列表
  static async getAccessoryTypes(): Promise<ApiResponse<string[]>> {
    return ApiService.get('/spare-inventory/accessory-types')
  }

  // 获取规格列表
  static async getSpecifications(accessoryType?: string): Promise<ApiResponse<string[]>> {
    return ApiService.get('/spare-inventory/specifications', { accessoryType })
  }

  // 获取货位列表
  static async getLocations(): Promise<ApiResponse<string[]>> {
    return ApiService.get('/spare-inventory/locations')
  }
}

// 库存相关的统一导出
export const InventoryAPI = {
  finished: FinishedInventoryAPI,
  spare: SpareInventoryAPI
} 