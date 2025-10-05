import { ApiService } from './api'
import type { PageMeta, PageResType } from './types'

export type ExportParams = Partial<{
  operator_account_id: string
  create_start: string
  create_end: string
  page: number | string
  limit: number | string
  order_by: string
  order_sort: 'asc' | 'desc'
}> & Record<string, unknown>

export type ExportRecord = {
  operator_account?: {
    id: string
    name: string
  }
  detail: Record<string, unknown>
  download_url?: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

type ExportListData = {
  list: ExportRecord[]
  meta: PageMeta
}

export const exports = (params: ExportParams): Promise<PageResType<ExportRecord>> => {
  return ApiService.get<ExportListData>('/export/records', params)
}
