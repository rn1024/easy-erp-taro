import { ApiService } from './api'
import type { ResType, PageResType, FAQItem, HelpCategory } from './types'

export class HelpService {
  // 获取帮助分类列表
  static async getCategories(): Promise<ResType<HelpCategory[]>> {
    return ApiService.get<HelpCategory[]>('/help/categories')
  }

  // 获取FAQ列表
  static async getFAQs(params?: {
    category?: string
    keyword?: string
    page?: number
    pageSize?: number
  }): Promise<PageResType<FAQItem>> {
    return ApiService.get<FAQItem[]>('/help/faqs', params) as Promise<PageResType<FAQItem>>
  }

  // 获取单个FAQ详情
  static async getFAQ(id: string): Promise<ResType<FAQItem>> {
    return ApiService.get<FAQItem>(`/help/faqs/${id}`)
  }

  // 搜索帮助内容
  static async searchHelp(keyword: string, params?: {
    category?: string
    page?: number
    pageSize?: number
  }): Promise<PageResType<FAQItem>> {
    return ApiService.get<FAQItem[]>('/help/search', {
      keyword,
      ...params
    }) as Promise<PageResType<FAQItem>>
  }

  // FAQ有用反馈
  static async markHelpful(id: string, helpful: boolean): Promise<ResType<{ helpful: number }>> {
    return ApiService.post<{ helpful: number }>(`/help/faqs/${id}/helpful`, { helpful })
  }

  // 提交问题反馈
  static async submitFeedback(data: {
    question: string
    email?: string
    category: string
  }): Promise<ResType<{ id: string }>> {
    return ApiService.post<{ id: string }>('/help/feedback', data, {
      showLoading: true,
      loadingText: '提交中...'
    })
  }
}

export default HelpService