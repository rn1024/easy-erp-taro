import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export type ForwardersParams = Partial<{
  page: number
  pageSize: number
  nickname: string
  companyName: string
}> & Record<string, unknown>

export type Forwarder = {
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
  remark?: string
  operatorId: string
  createdAt: string
  updatedAt: string
  operator?: {
    id: string
    name: string
  }
}

export type ForwarderFormData = {
  nickname: string
  avatarUrl?: string
  contactPerson: string
  contactPhone: string
  companyName: string
  creditCode?: string
  bankName?: string
  bankAccount?: string
  bankAddress?: string
  remark?: string
}

type ForwarderListData = {
  list: Forwarder[]
  meta: PageMeta
}

export const getForwarders = (params: ForwardersParams = {}): Promise<PageResType<Forwarder>> => {
  return ApiService.get<ForwarderListData>('/forwarding-agents', params)
}

export const getForwarder = (id: string): Promise<ResType<Forwarder>> => {
  return ApiService.get<Forwarder>(`/forwarding-agents/${id}`)
}

export const createForwarder = (data: ForwarderFormData): Promise<ResType<Forwarder>> => {
  return ApiService.post<Forwarder>('/forwarding-agents', data)
}

export const updateForwarder = (id: string, data: Partial<ForwarderFormData>): Promise<ResType<Forwarder>> => {
  return ApiService.put<Forwarder>(`/forwarding-agents/${id}`, data)
}

export const deleteForwarder = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/forwarding-agents/${id}`)
}
