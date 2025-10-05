import type { ApiResponse, PaginatedResponse } from '@/types'

export interface PageMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ResType<T> = ApiResponse<T>

export type PageResType<T> = ApiResponse<PaginatedResponse<T>>

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  shop: string
  quantity: number
  status: 'sufficient' | 'low' | 'out_of_stock'
  location: string
  dimensions: string
  weight: string
  createdAt: string
  updatedAt: string
}

export interface InventoryFilters {
  keyword?: string
  shops?: string[]
  categories?: string[]
  status?: string[]
}

export interface StatsData {
  title: string
  value: number | string
  icon?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
  status?: 'normal' | 'warning' | 'error'
}

export interface QuickActionItem {
  id: string
  title: string
  description: string
  icon: string
  action: string
  color?: string
  disabled?: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  department: string
  lastLoginTime: string
  createdAt: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  deviceManagement: boolean
  autoLock: boolean
  biometricLogin: boolean
}

export interface LoginDevice {
  id: string
  name: string
  type: 'mobile' | 'desktop' | 'tablet'
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  tags?: string[]
}

export interface HelpCategory {
  id: string
  name: string
  icon: string
  description: string
  questionCount: number
}

export interface ProductSearchFilters {
  keyword?: string
  shop?: string
  category?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface WarehouseTask {
  id: string
  title: string
  type: 'shipment' | 'receiving' | 'inventory' | 'quality_check'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string
  progress: number
  dueDate: string
  createdAt: string
}

export interface WarehouseFilters {
  status?: string[]
  type?: string[]
  priority?: string[]
  assignee?: string[]
}
