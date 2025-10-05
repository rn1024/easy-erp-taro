import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export type AccountsParams = Partial<{
  limit: number | string
  page: number | string
  status: number | string
  name: string
  withRole: boolean
}> & Record<string, unknown>

export type AccountsResponse = {
  created_at: string
  deleted_at: string | null
  id: string
  name: string
  operator: string
  status: number
  updated_at: string
  roles?: Array<{
    id: string
    name: string
    permissions: string[]
    status: number
  }>
}

export type CAccountData = {
  name: string
  operator: string
  password?: string
  status?: number
  roleIds?: string[]
}

export type RAccountResponse = AccountsResponse & {
  permissions: string[]
  roles: Array<{
    id: string
    name: string
    status: number
  }>
}

export type UAccountData = Partial<CAccountData>

export type UpdateAccountPasswordData = {
  old_password: string
  new_password: string
}

type AccountsListData = {
  list: AccountsResponse[]
  meta: PageMeta
}

export const accounts = (params: AccountsParams): Promise<PageResType<AccountsResponse>> => {
  return ApiService.get<AccountsListData>('/accounts', params)
}

export const cAccount = (data: CAccountData): Promise<ResType<AccountsResponse>> => {
  return ApiService.post<AccountsResponse>('/accounts', data)
}

export const rAccount = (id: string): Promise<ResType<RAccountResponse>> => {
  return ApiService.get<RAccountResponse>(`/accounts/${id}`)
}

export const uAccount = (id: string, data: UAccountData): Promise<ResType<AccountsResponse>> => {
  return ApiService.put<AccountsResponse>(`/accounts/${id}`, data)
}

export const dAccount = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/accounts/${id}`)
}

export const cAccountPwd = (id: string | number, data: UpdateAccountPasswordData): Promise<ResType<AccountsResponse>> => {
  return ApiService.put<AccountsResponse>(`/accounts/${id}/password`, data)
}
