import type { ApiResponse, PaginatedResponse } from '@/types'
import type { WarehouseTask, PackageTask, ShipmentTask } from '@/types/admin'
import { ApiService } from './api'

export type WarehouseTaskParams = Partial<{
  page: number
  pageSize: number
  status: string
  type: string
  shopId: string
  categoryId: string
  productId: string
}> & Record<string, unknown>

export type PackageTaskParams = Partial<{
  page: number
  pageSize: number
  status: string
  keyword: string
}> & Record<string, unknown>

export type ShipmentTaskParams = Partial<{
  page: number
  pageSize: number
  status: string
  keyword: string
}> & Record<string, unknown>

export const getWarehouseTaskList = (params: WarehouseTaskParams = {}): Promise<ApiResponse<PaginatedResponse<WarehouseTask>>> => {
  return ApiService.get('/warehouse-tasks', params)
}

export const getWarehouseTaskDetail = (id: string): Promise<ApiResponse<WarehouseTask>> => {
  return ApiService.get(`/warehouse-tasks/${id}`)
}

export const updateWarehouseTaskStatus = (id: string, status: string): Promise<ApiResponse<WarehouseTask>> => {
  return ApiService.put(`/warehouse-tasks/${id}`, { status })
}

export const getPackageTaskList = (params: PackageTaskParams = {}): Promise<ApiResponse<PaginatedResponse<PackageTask>>> => {
  return ApiService.get('/warehouse-tasks', { ...params, type: 'package' })
}

export const getPackageTaskDetail = (id: string): Promise<ApiResponse<PackageTask>> => {
  return ApiService.get(`/warehouse-tasks/${id}`)
}

export const updatePackageTaskStatus = (id: string, status: string): Promise<ApiResponse<PackageTask>> => {
  return ApiService.put(`/warehouse-tasks/${id}/status`, { status })
}

export const startPackageTask = (id: string): Promise<ApiResponse<PackageTask>> => {
  return ApiService.post(`/warehouse-tasks/${id}/start`)
}

export const completePackageTask = (
  id: string,
  data: {
    actualWeight?: number
    packingNote?: string
  }
): Promise<ApiResponse<PackageTask>> => {
  return ApiService.post(`/warehouse-tasks/${id}/complete`, data)
}

export const getPackageTaskStatusOptions = (): Promise<ApiResponse<Array<{ label: string; value: string }>>> => {
  return ApiService.get('/warehouse-tasks/status-options', { type: 'package' })
}

export const getShipmentTaskList = (params: ShipmentTaskParams = {}): Promise<ApiResponse<PaginatedResponse<ShipmentTask>>> => {
  return ApiService.get('/warehouse-tasks', { ...params, type: 'shipment' })
}

export const getShipmentTaskDetail = (id: string): Promise<ApiResponse<ShipmentTask>> => {
  return ApiService.get(`/warehouse-tasks/${id}`)
}

export const updateShipmentTaskStatus = (id: string, status: string): Promise<ApiResponse<ShipmentTask>> => {
  return ApiService.put(`/warehouse-tasks/${id}/status`, { status })
}

export const confirmShipmentTask = (
  id: string,
  data: {
    trackingNumber?: string
    carrier?: string
    shipmentNote?: string
  }
): Promise<ApiResponse<ShipmentTask>> => {
  return ApiService.post(`/warehouse-tasks/${id}/confirm`, data)
}

export const confirmShipmentArrival = (id: string): Promise<ApiResponse<ShipmentTask>> => {
  return ApiService.post(`/warehouse-tasks/${id}/arrival`)
}

export const completeShipmentReceiving = (
  id: string,
  data: {
    receivedQuantity?: number
    receivingNote?: string
  }
): Promise<ApiResponse<ShipmentTask>> => {
  return ApiService.post(`/warehouse-tasks/${id}/receive`, data)
}

export const getShipmentTaskStatusOptions = (): Promise<ApiResponse<Array<{ label: string; value: string }>>> => {
  return ApiService.get('/warehouse-tasks/status-options', { type: 'shipment' })
}

export const getShipmentCarriers = (): Promise<ApiResponse<string[]>> => {
  return ApiService.get('/warehouse-tasks/carriers')
}
