import { ApiService } from './api'
import type { PackageTask, ShipmentTask } from '@/types/admin'
import type { ApiResponse, PaginatedResponse } from '@/types'

// 包装任务API
export class PackageTaskAPI {
  // 获取包装任务列表
  static async getList(params: {
    page?: number
    pageSize?: number
    status?: string
    keyword?: string
  } = {}): Promise<ApiResponse<PaginatedResponse<PackageTask>>> {
    return ApiService.get('/api/tasks/package', params)
  }

  // 获取包装任务详情
  static async getDetail(id: string): Promise<ApiResponse<PackageTask>> {
    return ApiService.get(`/api/tasks/package/${id}`)
  }

  // 更新包装任务状态
  static async updateStatus(id: string, status: string): Promise<ApiResponse<PackageTask>> {
    return ApiService.put(`/api/tasks/package/${id}/status`, { status })
  }

  // 开始包装任务
  static async start(id: string): Promise<ApiResponse<PackageTask>> {
    return ApiService.post(`/api/tasks/package/${id}/start`)
  }

  // 完成包装任务
  static async complete(id: string, data: {
    actualWeight?: number
    packingNote?: string
  }): Promise<ApiResponse<PackageTask>> {
    return ApiService.post(`/api/tasks/package/${id}/complete`, data)
  }

  // 获取状态选项
  static async getStatusOptions(): Promise<ApiResponse<Array<{ label: string; value: string }>>> {
    return ApiService.get('/api/tasks/package/status-options')
  }
}

// 发货任务API
export class ShipmentTaskAPI {
  // 获取发货任务列表
  static async getList(params: {
    page?: number
    pageSize?: number
    status?: string
    keyword?: string
  } = {}): Promise<ApiResponse<PaginatedResponse<ShipmentTask>>> {
    return ApiService.get('/api/tasks/shipment', params)
  }

  // 获取发货任务详情
  static async getDetail(id: string): Promise<ApiResponse<ShipmentTask>> {
    return ApiService.get(`/api/tasks/shipment/${id}`)
  }

  // 更新发货任务状态
  static async updateStatus(id: string, status: string): Promise<ApiResponse<ShipmentTask>> {
    return ApiService.put(`/api/tasks/shipment/${id}/status`, { status })
  }

  // 确认发货
  static async confirmShipment(id: string, data: {
    trackingNumber?: string
    carrier?: string
    shipmentNote?: string
  }): Promise<ApiResponse<ShipmentTask>> {
    return ApiService.post(`/api/tasks/shipment/${id}/confirm`, data)
  }

  // 确认到港
  static async confirmArrival(id: string): Promise<ApiResponse<ShipmentTask>> {
    return ApiService.post(`/api/tasks/shipment/${id}/arrival`)
  }

  // 完成接收
  static async completeReceiving(id: string, data: {
    receivedQuantity?: number
    receivingNote?: string
  }): Promise<ApiResponse<ShipmentTask>> {
    return ApiService.post(`/api/tasks/shipment/${id}/receive`, data)
  }

  // 获取状态选项
  static async getStatusOptions(): Promise<ApiResponse<Array<{ label: string; value: string }>>> {
    return ApiService.get('/api/tasks/shipment/status-options')
  }

  // 获取承运商列表
  static async getCarriers(): Promise<ApiResponse<string[]>> {
    return ApiService.get('/api/tasks/shipment/carriers')
  }
}

// 任务相关的统一导出
export const TasksAPI = {
  package: PackageTaskAPI,
  shipment: ShipmentTaskAPI
} 