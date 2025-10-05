import type { Task, WorkflowStep, DashboardStats, QuickAction, Message } from '@/types'

// 模拟任务数据
export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: '产品需求评审',
    description: '对新版本产品功能进行需求评审，确认技术实现方案',
    status: 'progress',
    priority: 'high',
    assignee: {
      id: '1',
      name: '张三',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-25',
    createdAt: '2025-06-20',
    workflow: {
      currentStep: 2,
      totalSteps: 4,
      stepName: '技术评审'
    }
  },
  {
    id: '2',
    title: '用户界面设计',
    description: '完成新功能的UI/UX设计，包括原型图和交互说明',
    status: 'pending',
    priority: 'medium',
    assignee: {
      id: '2',
      name: '李四',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-28',
    createdAt: '2025-06-21',
    workflow: {
      currentStep: 1,
      totalSteps: 3,
      stepName: '设计初稿'
    }
  },
  {
    id: '3',
    title: '数据库优化',
    description: '优化数据库查询性能，提升系统响应速度',
    status: 'completed',
    priority: 'high',
    assignee: {
      id: '3',
      name: '王五',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-22',
    createdAt: '2025-06-18',
    workflow: {
      currentStep: 3,
      totalSteps: 3,
      stepName: '已完成'
    }
  },
  {
    id: '4',
    title: '移动端适配',
    description: '完成移动端响应式设计适配，确保各设备正常显示',
    status: 'rejected',
    priority: 'low',
    assignee: {
      id: '4',
      name: '赵六',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-20',
    createdAt: '2025-06-15',
    workflow: {
      currentStep: 2,
      totalSteps: 4,
      stepName: '设计审查'
    }
  }
]

// 模拟工作流步骤数据
export const MOCK_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: '1',
    name: '需求确认',
    status: 'completed',
    assignee: {
      id: '1',
      name: '产品经理',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    completedAt: '2025-06-20T10:30:00',
    comment: '需求已确认，可以进入下一步'
  },
  {
    id: '2',
    name: '技术评审',
    status: 'current',
    assignee: {
      id: '2',
      name: '技术负责人',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    name: '开发实现',
    status: 'pending',
    assignee: {
      id: '3',
      name: '开发工程师',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '4',
    name: '测试验收',
    status: 'pending',
    assignee: {
      id: '4',
      name: '测试工程师',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    }
  }
]

// 模拟仪表板统计数据
export const MOCK_STATS: DashboardStats = {
  totalTasks: 24,
  completedTasks: 18,
  pendingTasks: 4,
  overdueTasks: 2,
  activeUsers: 12,
  completionRate: 75,
  avgCompletionTime: '2.5天',
  trend: 'up'
}

// 模拟快速操作数据
export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'create_workflow',
    title: '创建工作流',
    description: '设计新的业务流程',
    icon: '⚡',
    color: '#3b82f6'
  },
  {
    id: 'my_tasks',
    title: '我的任务',
    description: '查看分配给我的任务',
    icon: '📋',
    color: '#10b981'
  },
  {
    id: 'pending_approval',
    title: '待审批',
    description: '需要我审批的事项',
    icon: '✅',
    color: '#f59e0b'
  },
  {
    id: 'form_example',
    title: '表单示例',
    description: '查看表单组件库',
    icon: '📝',
    color: '#ef4444'
  }
]

// 模拟消息数据
export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'task',
    title: '新任务分配',
    content: '您有新的任务"产品需求评审"需要处理',
    timestamp: '2025-01-09T10:30:00Z',
    read: false,
    sender: {
      id: '1',
      name: '系统管理员',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '2',
    type: 'workflow',
    title: '工作流更新',
    content: '工作流"项目评审流程"已更新，请查看最新版本',
    timestamp: '2025-01-09T09:15:00Z',
    read: false,
    sender: {
      id: '2',
      name: '流程管理员',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    type: 'info',
    title: '系统维护通知',
    content: '系统将于今晚23:00-01:00进行维护升级',
    timestamp: '2025-01-09T08:00:00Z',
    read: true,
    sender: {
      id: '3',
      name: '技术团队',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  }
]

// 用户角色和权限常量
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DEVELOPER: 'developer',
  VIEWER: 'viewer'
} as const

// 任务状态配置
export const TASK_STATUS_CONFIG = {
  pending: {
    label: '待处理',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  progress: {
    label: '进行中',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)'
  },
  completed: {
    label: '已完成',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  rejected: {
    label: '已拒绝',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)'
  }
} as const

// 任务优先级配置
export const TASK_PRIORITY_CONFIG = {
  low: {
    label: '低优先级',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  medium: {
    label: '中优先级',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  high: {
    label: '高优先级',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)'
  }
} as const

// 导航标签配置
export const NAVIGATION_TABS = [
  { id: 'home', label: '首页', icon: 'Home' },
  { id: 'tasks', label: '任务', icon: 'CheckSquare' },
  { id: 'create', label: '创建', icon: 'Plus' },
  { id: 'messages', label: '消息', icon: 'MessageCircle' },
  { id: 'profile', label: '我的', icon: 'User' }
] as const

// 表单验证规则
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^1[3-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/
} as const

// API端点常量
export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  WORKFLOWS: '/api/workflows',
  USERS: '/api/users',
  MESSAGES: '/api/messages',
  UPLOAD: '/api/upload'
} as const

// 本地存储键
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user-preferences',
  TASK_FILTERS: 'task-filters',
  APP_THEME: 'app-theme',
  USER_SETTINGS: 'user-settings',
  TEMP_DATA: 'temp-data'
} as const

// 应用配置常量
export const APP_CONFIG = {
  NAME: 'WeChat Task Management',
  VERSION: '1.0.0',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000
} as const

// 错误消息常量
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接异常，请稍后重试',
  UNAUTHORIZED: '未授权访问，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  VALIDATION_ERROR: '输入数据格式不正确',
  FILE_TOO_LARGE: '文件大小超出限制',
  UNSUPPORTED_FILE_TYPE: '不支持的文件类型'
} as const

// 成功消息常量
export const SUCCESS_MESSAGES = {
  TASK_CREATED: '任务创建成功',
  TASK_UPDATED: '任务更新成功',
  TASK_DELETED: '任务删除成功',
  WORKFLOW_CREATED: '工作流创建成功',
  WORKFLOW_UPDATED: '工作流更新成功',
  PROFILE_UPDATED: '个人资料更新成功',
  SETTINGS_SAVED: '设置保存成功',
  FILE_UPLOADED: '文件上传成功'
} as const