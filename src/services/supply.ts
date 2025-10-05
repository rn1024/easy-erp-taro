import { ApiService } from './api'
import type { ResType } from './types'

export type ShareConfig = {
  expiresIn: number
  extractCode?: string | null
  accessLimit?: number
}

export type ShareLinkInfo = {
  shareCode: string
  extractCode: string | null
  shareUrl: string
  expiresAt: string
  accessLimit?: number
}

export type ShareHistoryItem = {
  id: string
  shareCode: string
  shareUrl: string
  extractCode?: string
  purchaseOrderId: string
  orderNumber?: string
  createdBy?: string
  expiresAt: string
  status: string
  accessCount: number
  uniqueUserCount: number
  accessLimit?: number
  createdAt: string
}

export type SupplyStatistics = {
  totalRecords: number
  activeRecords: number
  totalAmount: number
  productStatuses: Array<{
    productId: string
    purchaseQuantity: number
    suppliedQuantity: number
    availableQuantity: number
    supplyProgress: number
  }>
}

export type SupplyRecord = {
  id: string
  status: string
  supplierInfo: Record<string, unknown>
  totalAmount: number
  itemCount: number
  items: Array<{
    id: string
    product: {
      id: string
      code: string
      specification?: string
      color?: string
    }
    quantity: number
    unitPrice: number
    totalPrice: number
    remark?: string
  }>
  remark?: string
  createdAt: string
  updatedAt: string
}

export type SupplySubmitData = {
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
    totalPrice: number
    remark?: string
  }>
  totalAmount: number
  remark?: string
}

export const createShareLinkApi = (purchaseOrderId: string, config: ShareConfig): Promise<ResType<ShareLinkInfo>> => {
  return ApiService.post<ShareLinkInfo>(`/purchase-orders/${purchaseOrderId}/share`, config)
}

export const getShareLinkApi = (purchaseOrderId: string): Promise<ResType<ShareLinkInfo | null>> => {
  return ApiService.get<ShareLinkInfo | null>(`/purchase-orders/${purchaseOrderId}/share`)
}

export const updateShareLinkApi = (purchaseOrderId: string, config: Partial<ShareConfig>): Promise<ResType<ShareLinkInfo>> => {
  return ApiService.put<ShareLinkInfo>(`/purchase-orders/${purchaseOrderId}/share`, config)
}

export const disableShareLinkApi = (purchaseOrderId: string): Promise<ResType<unknown>> => {
  return ApiService.delete<unknown>(`/purchase-orders/${purchaseOrderId}/share`)
}

export const getSupplyRecordsApi = (purchaseOrderId: string): Promise<ResType<{ records: SupplyRecord[]; statistics: SupplyStatistics }>> => {
  return ApiService.get<{ records: SupplyRecord[]; statistics: SupplyStatistics }>(`/purchase-orders/${purchaseOrderId}/supply-records`)
}

export const disableSupplyRecordApi = (recordId: string): Promise<ResType<unknown>> => {
  return ApiService.put<unknown>(`/supply-records/${recordId}/disable`)
}

export const getShareHistoryApi = (params: { purchaseOrderId?: string; page?: number; pageSize?: number } = {}): Promise<ResType<{ list: ShareHistoryItem[]; meta: Record<string, unknown> }>> => {
  return ApiService.get('/share/history', params)
}

export const getShareStatisticsApi = (shareCode: string): Promise<ResType<SupplyStatistics>> => {
  return ApiService.post<SupplyStatistics>('/share/history', { shareCode })
}

export const verifyShareLinkApi = (shareCode: string, extractCode?: string): Promise<ResType<unknown>> => {
  return ApiService.post('/share/verify', {
    shareCode,
    extractCode
  })
}

export const getSharedPurchaseOrderApi = (shareCode: string, extractCode?: string): Promise<ResType<Record<string, unknown>>> => {
  return ApiService.get(`/share/${shareCode}/info`, extractCode ? { extractCode } : undefined)
}

export const getSharedProductsApi = (shareCode: string, extractCode?: string): Promise<ResType<Record<string, unknown>>> => {
  return ApiService.get(`/share/${shareCode}/products`, extractCode ? { extractCode } : undefined)
}

export const submitSupplyListApi = (shareCode: string, data: SupplySubmitData, extractCode?: string): Promise<ResType<Record<string, unknown>>> => {
  return ApiService.post(`/share/${shareCode}/supply`, {
    ...data,
    ...(extractCode ? { extractCode } : {})
  })
}

export const getSupplyStatsApi = (purchaseOrderIds: string[]): Promise<ResType<unknown>> => {
  return ApiService.post('/purchase-orders/supply-stats', { orderIds: purchaseOrderIds })
}

export const getSupplierHistoryRecordsApi = (supplierId: string): Promise<ResType<Record<string, unknown>>> => {
  return ApiService.get(`/suppliers/${supplierId}/supply-history`)
}

export const checkAndUpdateOrderStatusApi = (purchaseOrderId: string): Promise<ResType<Record<string, unknown>>> => {
  return ApiService.post(`/purchase-orders/${purchaseOrderId}/check-status`)
}
