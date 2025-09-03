// 用户相关类型
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  lastLoginTime?: string
}

// 任务相关类型
export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: User
  creator: User
  dueDate: string
  createdAt: string
  updatedAt: string
  progress: number
  workflowId?: string
  tags: string[]
  workflow: {
    currentStep: number
    totalSteps: number
    stepName: string
  }
}

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// 工作流相关类型
export interface WorkflowStep {
  id: string
  name: string
  description: string
  status: StepStatus
  assignee?: User
  dueDate?: string
  completedAt?: string
  order: number
}

export type StepStatus = 'pending' | 'active' | 'completed' | 'skipped'

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  status: WorkflowStatus
  creator: User
  createdAt: string
  updatedAt: string
  category: string
  tags: string[]
}

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'

// 仪表板统计类型
export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  activeWorkflows: number
  completedWorkflows: number
  completionRate: number
  avgTaskDuration: number
}

// 快速操作类型
export interface QuickAction {
  id: string
  title: string
  icon: string
  description: string
  action: string
  color?: string
  disabled?: boolean
}

// 消息相关类型
export interface Message {
  id: string
  title: string
  content: string
  sender: User
  recipient: User
  type: MessageType
  status: MessageStatus
  createdAt: string
  readAt?: string
}

export type MessageType = 'system' | 'task' | 'workflow' | 'announcement' | 'personal'
export type MessageStatus = 'unread' | 'read' | 'archived'

// 搜索和过滤类型
export interface SearchFilters {
  keyword?: string
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assignee?: string[]
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
}

// API响应类型 - 适配easy-erp-web格式
export interface ApiResponse<T = unknown> {
  code: number    // 0: 成功, 非0: 失败
  msg: string     // 响应消息
  data: T         // 响应数据
}

// 分页响应类型 - 适配easy-erp-web格式
export interface PaginatedResponse<T = unknown> {
  list: T[]           // 数据列表 (适配easy-erp-web的list字段)
  total: number       // 总记录数
  page: number        // 当前页码
  pageSize: number    // 每页大小
  totalPages: number  // 总页数
}

// 表单相关类型
export interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'checkbox' | 'radio'
  required: boolean
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  defaultValue?: string | number | boolean
}

export interface FormConfig {
  title: string
  description?: string
  fields: FormField[]
  submitText?: string
  cancelText?: string
}

// 通用组件属性类型
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

// 导航相关类型
export interface NavigationItem {
  id: string
  title: string
  icon: string
  path: string
  badge?: number
  disabled?: boolean
}

// 设置相关类型
export interface UserSettings {
  language: 'zh-CN' | 'en-US'
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    taskReminders: boolean
    workflowUpdates: boolean
  }
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
  }
}

// 权限相关类型
export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
}

// 工作流模板类型
export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  steps: Omit<WorkflowStep, 'id' | 'status' | 'assignee' | 'completedAt'>[]
  isPublic: boolean
  creator: User
  usageCount: number
  tags: string[]
}

// 产品相关类型
export interface Product {
  id: string
  name: string
  shop: string
  category: string
  info?: string
  packaging?: string
  outerBox?: string
  accessories?: string
  remark?: string
  sku?: string
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  shop?: string
  category?: string
}