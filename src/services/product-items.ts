import { ApiService } from './api'
import type { ResType } from './types'

export enum ProductItemRelatedType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  PACKAGING_TASK = 'PACKAGING_TASK'
}

export type ProductItemInfo = {
  id: string
  relatedType: ProductItemRelatedType
  relatedId: string
  productId: string
  quantity: number
  unitPrice?: number
  amount?: number
  taxRate?: number
  taxAmount?: number
  totalAmount?: number
  completedQuantity?: number
  remark?: string
  createdAt: string
  updatedAt: string
  product?: {
    id: string
    code: string
    sku: string
    specification?: string
    color?: string
    shop?: {
      id: string
      nickname: string
    }
    category?: {
      id: string
      name: string
    }
  }
}

export type ProductItemData = {
  productId: string
  quantity: number
  unitPrice?: number
  amount?: number
  taxRate?: number
  taxAmount?: number
  totalAmount?: number
  completedQuantity?: number
  remark?: string
}

export type ProductItemsBatchParams = {
  relatedType: ProductItemRelatedType
  relatedId: string
  items: ProductItemData[]
}

export const getProductItems = (relatedType: ProductItemRelatedType, relatedId: string): Promise<ResType<ProductItemInfo[]>> => {
  return ApiService.get<ProductItemInfo[]>('/product-items', { relatedType, relatedId })
}

export const saveProductItems = (params: ProductItemsBatchParams): Promise<ResType<ProductItemInfo[]>> => {
  return ApiService.post<ProductItemInfo[]>('/product-items', params)
}

export const calculatePurchaseOrderItemAmounts = (
  quantity: number,
  unitPrice: number,
  taxRate: number
): { amount: number; taxAmount: number; totalAmount: number } => {
  const amount = quantity * unitPrice
  const taxAmount = amount * (taxRate / 100)
  const totalAmount = amount + taxAmount

  return {
    amount: Number(amount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2))
  }
}

export const calculatePackagingTaskProgress = (items: ProductItemInfo[]): number => {
  if (!items.length) return 0

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const completedQuantity = items.reduce((sum, item) => sum + (item.completedQuantity ?? 0), 0)

  if (totalQuantity === 0) return 0
  return Math.round((completedQuantity / totalQuantity) * 100 * 100) / 100
}

export const validateProductItems = (items: ProductItemData[], relatedType: ProductItemRelatedType): string[] => {
  const errors: string[] = []

  if (!items.length) {
    errors.push('至少需要添加一个产品明细')
    return errors
  }

  items.forEach((item, index) => {
    if (!item.productId) {
      errors.push(`第${index + 1}行：请选择产品`)
    }
    if (!item.quantity || item.quantity <= 0) {
      errors.push(`第${index + 1}行：数量必须大于0`)
    }

    if (relatedType === ProductItemRelatedType.PURCHASE_ORDER) {
      if (item.unitPrice === undefined || item.unitPrice < 0) {
        errors.push(`第${index + 1}行：单价不能为负数`)
      }
      if (item.taxRate === undefined || item.taxRate < 0 || item.taxRate > 100) {
        errors.push(`第${index + 1}行：税率必须在0-100之间`)
      }
    }

    if (relatedType === ProductItemRelatedType.PACKAGING_TASK) {
      if (item.completedQuantity !== undefined && item.completedQuantity > item.quantity) {
        errors.push(`第${index + 1}行：完成数量不能超过总数量`)
      }
    }
  })

  return errors
}
