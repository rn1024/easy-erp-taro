// 基础类型定义
export interface User {
  id: string
  name: string
  avatar: string
  email?: string
  role?: string
}

// 任务相关类型
export type TaskStatus = 'pending' | 'progress' | 'completed' | 'rejected'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: User
  dueDate: string
  createdAt: string
  workflow: {
    currentStep: number
    totalSteps: number
    stepName: string
  }
}

// 工作流相关类型
export type WorkflowStepStatus = 'pending' | 'current' | 'completed' | 'rejected'

export interface WorkflowStep {
  id: string
  name: string
  status: WorkflowStepStatus
  assignee: User
  completedAt?: string
  comment?: string
}

// 仪表板统计类型
export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  activeUsers: number
  completionRate: number
  avgCompletionTime: string
  trend: 'up' | 'down' | 'stable'
}

// 筛选器类型
export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  assignee?: string
  dateRange?: 'today' | 'week' | 'overdue'
}

// 快速操作类型
export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

// 消息类型
export type MessageType = 'info' | 'warning' | 'error' | 'success' | 'task' | 'workflow'

export interface Message {
  id: string
  type: MessageType
  title: string
  content: string
  timestamp: string
  read: boolean
  sender?: User
  actions?: Array<{
    id: string
    label: string
    action: () => void
  }>
}

// 设置相关类型
export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
  }
  preferences: {
    language: string
    theme: 'light' | 'dark' | 'auto'
    timezone: string
  }
}

// 表单相关类型
export interface FormField {
  id: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date'
  label: string
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface FormData {
  [key: string]: any
}

// 组件通用Props类型
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ClickableComponentProps extends BaseComponentProps {
  onClick?: () => void
  disabled?: boolean
}

// 导航相关类型
export type TabId = 'home' | 'tasks' | 'create' | 'messages' | 'profile'

export interface NavigationTab {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

// API相关类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 错误处理类型
export interface AppError {
  code: string
  message: string
  details?: any
}

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system'

// 本地存储键类型
export type StorageKey = 
  | 'user-preferences'
  | 'task-filters'
  | 'app-theme'
  | 'user-settings'

// 组件状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 事件处理器类型
export type EventHandler<T = void> = (data?: T) => void
export type AsyncEventHandler<T = void> = (data?: T) => Promise<void>

// 路由相关类型
export interface RouteParams {
  [key: string]: string | string[] | undefined
}

// 工作流构建器类型
export interface WorkflowNode {
  id: string
  type: 'start' | 'task' | 'decision' | 'end'
  name: string
  description?: string
  assignee?: User
  conditions?: string[]
  x: number
  y: number
}

export interface WorkflowConnection {
  id: string
  source: string
  target: string
  label?: string
}

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  createdAt: string
  updatedAt: string
  version: number
}

// 移动端特定类型
export interface TouchEvent {
  touches: Array<{
    clientX: number
    clientY: number
  }>
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down'
  distance: number
  velocity: number
}

// 权限相关类型
export type Permission = 
  | 'task:read'
  | 'task:write'
  | 'task:delete'
  | 'workflow:read'
  | 'workflow:write'
  | 'workflow:delete'
  | 'user:manage'
  | 'settings:write'

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

// 文件上传类型
export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadProgress?: number
  error?: string
}

// 通知类型
export interface Notification {
  id: string
  type: MessageType
  title: string
  message: string
  timestamp: string
  read: boolean
  actions?: Array<{
    label: string
    action: () => void
  }>
}