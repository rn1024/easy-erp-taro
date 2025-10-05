import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export type RoleItem = {
  id: string
  name: string
  status: number
  permissions: string[] | null
  operator: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreateRoleData = {
  name: string
  status: number
  operator: string
  permissions?: string[]
}

export type UpdateRoleData = CreateRoleData & {
  updated_at: string
  permissions: string[] | null
}

export type Permission = {
  code: string
  name: string
}

export type PermissionsResult = {
  list: Permission[]
  grouped: Record<string, Permission[]>
}

export type RoleListParams = Partial<{
  page: number
  limit: number
  name: string
  status: number
}> & Record<string, unknown>

type RoleListData = {
  list: RoleItem[]
  meta: PageMeta
}

export const roleListApi = (query: RoleListParams = {}): Promise<PageResType<RoleItem>> => {
  return ApiService.get<RoleListData>('/roles', query)
}

export const deleteRoleByIdApi = (id: string): Promise<ResType<RoleItem>> => {
  return ApiService.delete<RoleItem>(`/roles/${id}`)
}

export const createRoleApi = (data: CreateRoleData): Promise<ResType<RoleItem>> => {
  return ApiService.post<RoleItem>('/roles', data)
}

export const updateRoleApi = (id: string, data: UpdateRoleData): Promise<ResType<RoleItem>> => {
  return ApiService.put<RoleItem>(`/roles/${id}`, data)
}

export const queryRoleByIdApi = (id: string): Promise<ResType<RoleItem>> => {
  return ApiService.get<RoleItem>(`/roles/${id}`)
}

export const queryRoleByNameApi = (name: string): Promise<ResType<RoleItem>> => {
  return ApiService.get<RoleItem>(`/roles/name/${name}`)
}

export const getPermissionsApi = (type?: string): Promise<ResType<PermissionsResult>> => {
  return ApiService.get<PermissionsResult>('/permissions', type ? { type } : undefined)
}
