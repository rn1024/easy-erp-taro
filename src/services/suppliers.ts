import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export type SuppliersParams = Partial<{
  page: number
  pageSize: number
  nickname: string
  companyName: string
}> & Record<string, unknown>

export type Supplier = {
  id: string
  nickname: string
  avatarUrl?: string
  contactPerson: string
  contactPhone: string
  companyName: string
  creditCode?: string
  bankName?: string
  bankAccount?: string
  bankAddress?: string
  productionDays: number
  deliveryDays: number
  remark?: string
  operatorId: string
  createdAt: string
  updatedAt: string
  operator?: {
    id: string
    name: string
  }
}

export type SupplierFormData = {
  nickname: string
  avatarUrl?: string
  contactPerson: string
  contactPhone: string
  companyName: string
  creditCode?: string
  bankName?: string
  bankAccount?: string
  bankAddress?: string
  productionDays?: number
  deliveryDays?: number
  remark?: string
}

type SupplierListData = {
  list: Supplier[]
  meta: PageMeta
}

export const getSuppliers = (params: SuppliersParams = {}): Promise<PageResType<Supplier>> => {
  return ApiService.get<SupplierListData>('/suppliers', params)
}

export const getSupplier = (id: string): Promise<ResType<Supplier>> => {
  return ApiService.get<Supplier>(`/suppliers/${id}`)
}

export const createSupplier = (data: SupplierFormData): Promise<ResType<Supplier>> => {
  return ApiService.post<Supplier>('/suppliers', data)
}

export const updateSupplier = (id: string, data: Partial<SupplierFormData>): Promise<ResType<Supplier>> => {
  return ApiService.put<Supplier>(`/suppliers/${id}`, data)
}

export const deleteSupplier = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/suppliers/${id}`)
}
