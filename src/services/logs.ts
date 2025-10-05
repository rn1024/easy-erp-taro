import { ApiService } from './api'
import type { PageMeta, PageResType } from './types'

export type LogsParams = Partial<{
  category: string
  limit: number | string
  module: string
  operation_end: string
  operation_start: string
  operations: string[]
  operator_account_id: string
  page: number | string
  status: 'Failure' | 'Success'
}> & Record<string, unknown>

export type LogsResponse = {
  body: Record<string, unknown>
  category: string
  created_at: string
  id: string
  menu: string
  method: string
  module: string
  operation: string
  operator: string
  operator_account_id: string
  params: Record<string, unknown>
  path: string
  protocol: string
  query: Record<string, unknown>
  remote_address: string
  remote_port: string
  status: 'Failure' | 'Success'
  updated_at: string
  url: string
  deleted_at?: string | null
  err_code?: number
  err_msg?: string
}

type LogsListData = {
  list: LogsResponse[]
  meta: PageMeta
}

export const logs = (params: LogsParams): Promise<PageResType<LogsResponse>> => {
  return ApiService.get<LogsListData>('/logs', params)
}
