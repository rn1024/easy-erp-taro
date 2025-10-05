import type { ApiResponse, PaginatedResponse } from '@/types'
import type { FinishedInventory, SpareInventory } from '@/types/admin'
import { ApiService } from './api'

export type FinishedInventoryParams = Partial<{
  page: number
  pageSize: number
  shop: string
  category: string
  keyword: string
}> & Record<string, unknown>

export type FinishedInventoryExportParams = Partial<{
  shop: string
  category: string
  keyword: string
}> & Record<string, unknown>

export type SpareInventoryParams = Partial<{
  page: number
  pageSize: number
  shop: string
  category: string
  keyword: string
}> & Record<string, unknown>

export const getFinishedInventoryList = (params: FinishedInventoryParams = {}): Promise<ApiResponse<PaginatedResponse<FinishedInventory>>> => {
  return ApiService.get('/finished-inventory', params)
}

export const getFinishedInventoryDetail = (id: string): Promise<ApiResponse<FinishedInventory>> => {
  return ApiService.get(`/finished-inventory/${id}`)
}

export const createFinishedInventory = (data: Omit<FinishedInventory, 'id'>): Promise<ApiResponse<FinishedInventory>> => {
  return ApiService.post('/finished-inventory', data)
}

export const updateFinishedInventory = (id: string, data: Partial<FinishedInventory>): Promise<ApiResponse<FinishedInventory>> => {
  return ApiService.put(`/finished-inventory/${id}`, data)
}

export const deleteFinishedInventory = (id: string): Promise<ApiResponse<boolean>> => {
  return ApiService.delete(`/finished-inventory/${id}`)
}

export const batchDeleteFinishedInventory = (ids: string[]): Promise<ApiResponse<boolean>> => {
  return ApiService.post('/finished-inventory/batch-delete', { ids })
}

export const getFinishedInventoryShops = (): Promise<ApiResponse<string[]>> => {
  return ApiService.get('/shops')
}

export const getFinishedInventoryCategories = (shop?: string): Promise<ApiResponse<string[]>> => {
  return ApiService.get('/product-categories', shop ? { shop } : undefined)
}

export const getFinishedInventoryLocations = (): Promise<ApiResponse<string[]>> => {
  return ApiService.get('/finished-inventory/locations')
}

export const exportFinishedInventory = (params: FinishedInventoryExportParams = {}): Promise<ApiResponse<string>> => {
  return ApiService.get('/finished-inventory/export', params)
}

export const getSpareInventoryList = (params: SpareInventoryParams = {}): Promise<ApiResponse<PaginatedResponse<SpareInventory>>> => {
  return ApiService.get('/spare-inventory', params)
}

export const getSpareInventoryDetail = (id: string): Promise<ApiResponse<SpareInventory>> => {
  return ApiService.get(`/spare-inventory/${id}`)
}

export const createSpareInventory = (data: Omit<SpareInventory, 'id'>): Promise<ApiResponse<SpareInventory>> => {
  return ApiService.post('/spare-inventory', data)
}

export const updateSpareInventory = (id: string, data: Partial<SpareInventory>): Promise<ApiResponse<SpareInventory>> => {
  return ApiService.put(`/spare-inventory/${id}`, data)
}

export const deleteSpareInventory = (id: string): Promise<ApiResponse<boolean>> => {
  return ApiService.delete(`/spare-inventory/${id}`)
}

export const batchDeleteSpareInventory = (ids: string[]): Promise<ApiResponse<boolean>> => {
  return ApiService.post('/spare-inventory/batch-delete', { ids })
}

export const getSpareInventoryAccessoryTypes = (): Promise<ApiResponse<string[]>> => {
  return ApiService.get('/spare-inventory/accessory-types')
}

export const getSpareInventorySpecifications = (accessoryType?: string): Promise<ApiResponse<string[]>> => {
  return ApiService.get('/spare-inventory/specifications', accessoryType ? { accessoryType } : undefined)
}

export const getSpareInventoryLocations = (): Promise<ApiResponse<string[]>> => {
  return ApiService.get('/spare-inventory/locations')
}
