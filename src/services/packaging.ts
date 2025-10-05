import type { ApiResponse } from '@/types'
import { ApiService } from './api'

export enum PackagingTaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PackagingTaskType {
  PACKAGING = 'PACKAGING'
}

export const packagingTaskStatusOptions = [
  { label: '待处理', value: PackagingTaskStatus.PENDING, color: 'orange' },
  { label: '进行中', value: PackagingTaskStatus.IN_PROGRESS, color: 'blue' },
  { label: '已完成', value: PackagingTaskStatus.COMPLETED, color: 'green' },
  { label: '已取消', value: PackagingTaskStatus.CANCELLED, color: 'red' }
]

export const packagingTaskTypeOptions = [
  { label: '包装', value: PackagingTaskType.PACKAGING, color: 'purple' }
]

export const getPackagingTaskStatusLabel = (status: string): { label: string; value: string; color: string } => {
  return packagingTaskStatusOptions.find(option => option.value === status) ?? { label: status, value: status, color: 'default' }
}

export const getPackagingTaskTypeLabel = (type: string): { label: string; value: string; color: string } => {
  return packagingTaskTypeOptions.find(option => option.value === type) ?? { label: type, value: type, color: 'default' }
}

export type PackagingTaskItem = {
  productId: string
  quantity: number
  completedQuantity?: number
  remark?: string
}

export type PackagingTaskInfo = {
  id: string
  shopId: string
  progress?: number
  status: PackagingTaskStatus
  type: PackagingTaskType
  operatorId: string
  createdAt: string
  updatedAt: string
  items?: PackagingTaskItem[]
  shop?: {
    id: string
    nickname: string
  }
  operator?: {
    id: string
    name: string
  }
}

export type PackagingTaskListResult = {
  list: PackagingTaskInfo[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export type PackagingTaskQueryParams = Partial<{
  shopId: string
  status: PackagingTaskStatus
  type: PackagingTaskType
  productName: string
  productSpecification: string
  createdAtStart: string
  createdAtEnd: string
  operatorName: string
  page: number
  pageSize: number
}> & Record<string, unknown>

export type CreatePackagingTaskData = {
  shopId: string
  type: PackagingTaskType
  progress?: number
  status?: PackagingTaskStatus
  items?: PackagingTaskItem[]
}

export type UpdatePackagingTaskData = {
  progress?: number
  status?: PackagingTaskStatus
  type?: PackagingTaskType
  items?: PackagingTaskItem[]
}

export const getPackagingTasksApi = (params: PackagingTaskQueryParams = {}): Promise<ApiResponse<PackagingTaskListResult>> => {
  return ApiService.get('/packaging-tasks', params)
}

export const getPackagingTaskApi = (id: string): Promise<ApiResponse<PackagingTaskInfo>> => {
  return ApiService.get(`/packaging-tasks/${id}`)
}

export const createPackagingTaskApi = (data: CreatePackagingTaskData): Promise<ApiResponse<PackagingTaskInfo>> => {
  return ApiService.post('/packaging-tasks', data)
}

export const updatePackagingTaskApi = (id: string, data: UpdatePackagingTaskData): Promise<ApiResponse<PackagingTaskInfo>> => {
  return ApiService.put(`/packaging-tasks/${id}`, data)
}

export const deletePackagingTaskApi = (id: string): Promise<ApiResponse<{ message: string }>> => {
  return ApiService.delete(`/packaging-tasks/${id}`)
}
