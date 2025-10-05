import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export enum PurchaseOrderStatus {
  CREATED = 'CREATED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  CONFIRMED = 'CONFIRMED',
  PRODUCTION = 'PRODUCTION',
  SHIPPED = 'SHIPPED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export type PurchaseOrderItemInfo = {
  id: string
  purchaseOrderId: string
  productId: string
  quantity: number
  unitPrice: number
  amount: number
  totalAmount: number
  remark?: string
  createdAt: string
  updatedAt: string
  product: {
    id: string
    code: string
    specification?: string
    sku: string
    color?: string
    setQuantity?: number
    internalSize?: string
    externalSize?: string
    weight?: number
    imageUrl?: string
    category: {
      id: string
      name: string
    }
  }
}

export type PurchaseOrderInfo = {
  id: string
  orderNumber: string
  shopId: string
  supplierId: string
  totalAmount: number
  discountRate?: number
  discountAmount?: number
  finalAmount: number
  status: PurchaseOrderStatus
  urgent: boolean
  remark?: string
  operatorId: string
  createdAt: string
  updatedAt: string
  shop: {
    id: string
    nickname: string
    avatarUrl?: string
    responsiblePerson?: string
  }
  supplier: {
    id: string
    nickname: string
    avatarUrl?: string
    contactPerson: string
    contactPhone: string
    companyName?: string
    productionDays?: number
    deliveryDays?: number
  }
  operator: {
    id: string
    name: string
  }
  items: PurchaseOrderItemInfo[]
}

export type CreatePurchaseOrderItemData = {
  productId: string
  quantity: number
  unitPrice: number
  remark?: string
}

export type CreatePurchaseOrderData = {
  shopId: string
  supplierId: string
  urgent?: boolean
  remark?: string
  discountRate?: number
  items: CreatePurchaseOrderItemData[]
}

export type UpdatePurchaseOrderItemData = {
  id?: string
  productId: string
  quantity: number
  unitPrice: number
  remark?: string
}

export type UpdatePurchaseOrderData = {
  shopId?: string
  supplierId?: string
  status?: PurchaseOrderStatus
  urgent?: boolean
  remark?: string
  discountRate?: number
  items?: UpdatePurchaseOrderItemData[]
}

export type PurchaseOrderQueryParams = Partial<{
  page: number
  pageSize: number
  shopId: string
  supplierId: string
  productId: string
  productNickname: string
  productSpecification: string
  productSku: string
  status: PurchaseOrderStatus
  urgent: boolean
  operatorId: string
  startDate: string
  endDate: string
}> & Record<string, unknown>

type PurchaseOrderListData = {
  list: PurchaseOrderInfo[]
  meta: PageMeta
}

export type ApprovalHistoryItem = {
  id: string
  operator: string
  status: string
  remark?: string
  created_at: string
}

export type ApprovalResult = {
  success?: boolean
  message?: string
  [key: string]: unknown
}

export const getPurchaseOrdersApi = (params: PurchaseOrderQueryParams = {}): Promise<PageResType<PurchaseOrderInfo>> => {
  return ApiService.get<PurchaseOrderListData>('/purchase-orders', params)
}

export const getPurchaseOrderDetailApi = (id: string): Promise<ResType<PurchaseOrderInfo>> => {
  return ApiService.get<PurchaseOrderInfo>(`/purchase-orders/${id}`)
}

export const createPurchaseOrderApi = (data: CreatePurchaseOrderData): Promise<ResType<PurchaseOrderInfo>> => {
  return ApiService.post<PurchaseOrderInfo>('/purchase-orders', data)
}

export const updatePurchaseOrderApi = (id: string, data: UpdatePurchaseOrderData): Promise<ResType<PurchaseOrderInfo>> => {
  return ApiService.put<PurchaseOrderInfo>(`/purchase-orders/${id}`, data)
}

export const deletePurchaseOrderApi = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/purchase-orders/${id}`)
}

export const getApprovalHistoryApi = (params: { entityType: string; entityId: string }): Promise<ResType<ApprovalHistoryItem[]>> => {
  return ApiService.get<ApprovalHistoryItem[]>('/approvals/history', params)
}

export const approvePurchaseOrderApi = (
  id: string,
  data: {
    toStatus: string
    reason: string
    remark?: string
  }
): Promise<ResType<ApprovalResult>> => {
  return ApiService.post<ApprovalResult>(`/purchase-orders/${id}/approve`, data)
}
