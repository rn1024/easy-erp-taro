import { ApiService } from './api'
import type { ResType } from './types'

export type Shop = {
  id: string
  nickname: string
  description?: string
  status: string
  createdAt: string
  updatedAt: string
}

export type ProductCategory = {
  id: string
  name: string
  description?: string
  parentId?: string
  status: string
  createdAt: string
  updatedAt: string
}

export const getShops = (): Promise<ResType<Shop[]>> => {
  return ApiService.get<Shop[]>('/shops')
}

export const getProductCategories = (params?: { parentId?: string; status?: string }): Promise<ResType<ProductCategory[]>> => {
  return ApiService.get<ProductCategory[]>('/product-categories', params)
}

export const getShopDetail = (id: string): Promise<ResType<Shop>> => {
  return ApiService.get<Shop>(`/shops/${id}`)
}

export const getCategoryDetail = (id: string): Promise<ResType<ProductCategory>> => {
  return ApiService.get<ProductCategory>(`/product-categories/${id}`)
}
