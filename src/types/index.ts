/**
 * 通用类型定义
 */

// ==================== 基础类型 ====================

/**
 * 通用响应接口
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  success: boolean;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应
 */
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== 工作流相关类型 ====================

/**
 * 工作流状态
 */
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

/**
 * 任务状态
 */
export type TaskStatus = 'pending' | 'progress' | 'completed' | 'rejected';

/**
 * 优先级
 */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * 任务优先级
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * 工作流进度信息
 */
export interface WorkflowProgress {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

/**
 * 任务类型
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignee?: User;
  creator?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  progress?: number; // 进度百分比 0-100
  workflowId?: string;
  workflow?: WorkflowProgress; // 工作流进度信息
  tags?: string[];
  attachments?: Attachment[];
}

/**
 * 工作流定义
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  creator: User;
  participants: User[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  template?: boolean;
}

/**
 * 工作流步骤
 */
export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  order: number;
  type: 'approval' | 'task' | 'review' | 'notification';
  assigneeType: 'user' | 'role' | 'department';
  assigneeId?: string;
  isRequired: boolean;
  estimatedDuration?: number; // 小时
}

/**
 * 工作流实例
 */
export interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflow: Workflow;
  title: string;
  description?: string;
  status: WorkflowStatus;
  currentStepId?: string;
  initiator: User;
  participants: User[];
  startedAt: string;
  completedAt?: string;
  data: Record<string, any>;
}

// ==================== 用户相关类型 ====================

/**
 * 用户信息
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
  phone?: string;
  position?: string;
  joinDate?: string;
}

/**
 * 角色
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isActive: boolean;
}

/**
 * 权限
 */
export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  module: string;
}

/**
 * 部门
 */
export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  manager?: User;
  members: User[];
  level: number;
}

// ==================== 消息相关类型 ====================

/**
 * 消息类型
 */
export type MessageType = 'system' | 'workflow' | 'task' | 'mention';

/**
 * 消息
 */
export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  sender?: User;
  recipient: User;
  read: boolean;
  createdAt: string;
  relatedId?: string; // 关联的工作流或任务ID
}

// ==================== 文件相关类型 ====================

/**
 * 附件
 */
export interface Attachment {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: User;
  uploadedAt: string;
}

// ==================== 统计相关类型 ====================

/**
 * 概览统计
 */
export interface OverviewStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  activeUsers: number;
  completionRate: number;
  avgCompletionTime: string;
  trend: 'up' | 'down';
}

/**
 * 趋势数据点
 */
export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * 图表数据
 */
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

// ==================== 表单相关类型 ====================

/**
 * 表单字段类型
 */
export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  required: boolean;
  options?: string[];
  value?: any;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

/**
 * 表单配置
 */
export interface FormConfig {
  title: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
  cancelText?: string;
}

// ==================== 导航相关类型 ====================

/**
 * 导航标签
 */
export type TabKey = 'home' | 'tasks' | 'create' | 'messages' | 'profile';

/**
 * 快捷操作类型
 */
export type QuickActionType = 'create_workflow' | 'my_tasks' | 'team_tasks' | 'pending_approval';

/**
 * 快捷操作
 */
export interface QuickAction {
  type: QuickActionType;
  label: string;
  icon: string;
  color: string;
  count?: number;
  route?: string;
}

// ==================== 搜索筛选类型 ====================

/**
 * 搜索参数
 */
export interface SearchParams {
  keyword?: string;
  status?: WorkflowStatus[];
  priority?: Priority[];
  assigneeId?: string;
  creatorId?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

/**
 * 排序参数
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * 筛选选项
 */
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// ==================== 系统配置类型 ====================

/**
 * 应用配置
 */
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'production';
  apiBaseUrl: string;
  enableDebug: boolean;
  features: {
    notifications: boolean;
    fileUpload: boolean;
    analytics: boolean;
  };
}

/**
 * 用户设置
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
  };
}

// ==================== 事件类型 ====================

/**
 * 自定义事件
 */
export interface CustomEvent<T = any> {
  type: string;
  payload?: T;
  timestamp: number;
}

// 统计数据类型
export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalWorkflows: number;
  activeWorkflows: number;
}

// 导航菜单项类型
export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  badge?: number;
}
