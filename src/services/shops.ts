import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export type ShopsParams = Partial<{
  page: number
  pageSize: number
  nickname: string
}> & Record<string, unknown>

export type Shop = {
  id: string
  nickname: string
  avatarUrl?: string
  responsiblePerson: string
  remark?: string
  operatorId: string
  createdAt: string
  updatedAt: string
  operator?: {
    id: string
    name: string
  }
}

export type ShopFormData = {
  nickname: string
  avatarUrl?: string
  responsiblePerson: string
  remark?: string
}

type ShopListData = {
  list: Shop[]
  meta: PageMeta
}

export const getShops = (params: ShopsParams = {}): Promise<PageResType<Shop>> => {
  return ApiService.get<ShopListData>('/shops', params)
}

export const getShop = (id: string): Promise<ResType<Shop>> => {
  return ApiService.get<Shop>(`/shops/${id}`)
}

export const createShop = (data: ShopFormData): Promise<ResType<Shop>> => {
  return ApiService.post<Shop>('/shops', data)
}

export const updateShop = (id: string, data: Partial<ShopFormData>): Promise<ResType<Shop>> => {
  return ApiService.put<Shop>(`/shops/${id}`, data)
}

export const deleteShop = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/shops/${id}`)
}
