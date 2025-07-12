import { 
  User, 
  Task, 
  Workflow, 
  DashboardStats, 
  QuickAction, 
  Message, 
  WorkflowTemplate,
  TaskStatus,
  TaskPriority,
  MessageType
} from '../types'

// Mock用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: '产品经理',
    department: '产品部',
    lastLoginTime: '2024-06-24 09:30:00'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    role: '开发工程师',
    department: '技术部',
    lastLoginTime: '2024-06-24 10:15:00'
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    role: '设计师',
    department: '设计部',
    lastLoginTime: '2024-06-24 08:45:00'
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    role: '测试工程师',
    department: '技术部',
    lastLoginTime: '2024-06-23 17:20:00'
  }
]

// Mock任务数据
export const mockTasks: Task[] = [
  {
    id: '1',
    title: '产品需求评审',
    description: '对新版本产品功能进行需求评审，确认技术实现方案',
    status: 'in_progress' as TaskStatus,
    priority: 'high' as TaskPriority,
    assignee: mockUsers[0], // 张三
    creator: mockUsers[0],
    dueDate: '2024-06-25',
    createdAt: '2024-06-20 09:00:00',
    updatedAt: '2024-06-24 14:30:00',
    progress: 50,
    workflowId: '1',
    tags: ['产品', '需求', '评审'],
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
    status: 'pending' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignee: mockUsers[2], // 王五
    creator: mockUsers[0],
    dueDate: '2024-06-28',
    createdAt: '2024-06-21 10:30:00',
    updatedAt: '2024-06-24 11:00:00',
    progress: 33,
    workflowId: '1',
    tags: ['设计', 'UI', 'UX'],
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
    status: 'completed' as TaskStatus,
    priority: 'high' as TaskPriority,
    assignee: mockUsers[1], // 李四
    creator: mockUsers[0],
    dueDate: '2024-06-22',
    createdAt: '2024-06-18 14:20:00',
    updatedAt: '2024-06-22 12:00:00',
    progress: 100,
    workflowId: '1',
    tags: ['数据库', '性能', '优化'],
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
    status: 'cancelled' as TaskStatus,
    priority: 'low' as TaskPriority,
    assignee: mockUsers[3], // 赵六
    creator: mockUsers[0],
    dueDate: '2024-06-20',
    createdAt: '2024-06-15 08:15:00',
    updatedAt: '2024-06-20 16:45:00',
    progress: 50,
    workflowId: '1',
    tags: ['移动端', '响应式', '适配'],
    workflow: {
      currentStep: 2,
      totalSteps: 4,
      stepName: '设计审查'
    }
  }
]

// Mock工作流数据
export const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: '产品开发流程',
    description: '从需求分析到产品发布的完整开发流程',
    steps: [
      {
        id: '1',
        name: '需求分析',
        description: '分析用户需求，制定产品规格',
        status: 'completed',
        assignee: mockUsers[0],
        dueDate: '2024-07-05',
        completedAt: '2024-07-04 17:00:00',
        order: 1
      },
      {
        id: '2',
        name: '设计阶段',
        description: 'UI/UX设计和原型制作',
        status: 'active',
        assignee: mockUsers[2],
        dueDate: '2024-07-15',
        order: 2
      },
      {
        id: '3',
        name: '开发阶段',
        description: '功能开发和代码实现',
        status: 'pending',
        assignee: mockUsers[1],
        dueDate: '2024-07-25',
        order: 3
      },
      {
        id: '4',
        name: '测试阶段',
        description: '功能测试和问题修复',
        status: 'pending',
        assignee: mockUsers[3],
        dueDate: '2024-07-30',
        order: 4
      }
    ],
    status: 'active',
    creator: mockUsers[0],
    createdAt: '2024-07-01 09:00:00',
    updatedAt: '2024-07-11 15:30:00',
    category: '产品开发',
    tags: ['开发', '产品', '团队协作']
  }
]

// Mock仪表板统计数据
export const mockDashboardStats: DashboardStats = {
  totalTasks: 24,
  completedTasks: 18,
  pendingTasks: 4,
  overdueTasks: 2,
  activeWorkflows: 3,
  completedWorkflows: 12,
  completionRate: 75,
  avgTaskDuration: 3.5
}

// Mock快速操作数据
export const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    title: '创建任务',
    icon: 'add',
    description: '快速创建新任务',
    action: 'create_task',
    color: '#1890ff'
  },
  {
    id: '2',
    title: '发起审批',
    icon: 'check',
    description: '发起审批流程',
    action: 'start_approval',
    color: '#52c41a'
  },
  {
    id: '3',
    title: '查看报表',
    icon: 'chart',
    description: '查看数据报表',
    action: 'view_reports',
    color: '#faad14'
  },
  {
    id: '4',
    title: '团队协作',
    icon: 'team',
    description: '团队沟通协作',
    action: 'team_collaboration',
    color: '#722ed1'
  },
  {
    id: '5',
    title: '文档管理',
    icon: 'file',
    description: '管理项目文档',
    action: 'document_management',
    color: '#13c2c2'
  },
  {
    id: '6',
    title: '系统设置',
    icon: 'setting',
    description: '配置系统设置',
    action: 'system_settings',
    color: '#666666'
  }
]

// Mock消息数据
export const mockMessages: Message[] = [
  {
    id: '1',
    title: '任务分配通知',
    content: '您有一个新的任务"设计新版本界面"需要处理',
    sender: mockUsers[0],
    recipient: mockUsers[2],
    type: 'task' as MessageType,
    status: 'unread',
    createdAt: '2024-07-11 09:30:00'
  },
  {
    id: '2',
    title: '工作流审批',
    content: '产品开发流程已进入下一阶段，请及时处理',
    sender: mockUsers[0],
    recipient: mockUsers[1],
    type: 'workflow' as MessageType,
    status: 'read',
    createdAt: '2024-07-11 08:15:00',
    readAt: '2024-07-11 10:30:00'
  },
  {
    id: '3',
    title: '系统维护通知',
    content: '系统将于今晚22:00-24:00进行维护升级',
    sender: mockUsers[0],
    recipient: mockUsers[1],
    type: 'system' as MessageType,
    status: 'read',
    createdAt: '2024-07-10 16:00:00',
    readAt: '2024-07-11 09:00:00'
  }
]

// Mock工作流模板
export const mockWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: '1',
    name: '请假申请流程',
    description: '员工请假申请的标准流程',
    category: '人事管理',
    steps: [
      {
        name: '提交申请',
        description: '员工填写请假申请表',
        order: 1
      },
      {
        name: '直属主管审批',
        description: '直属主管审核请假申请',
        order: 2
      },
      {
        name: 'HR审批',
        description: 'HR部门最终审批',
        order: 3
      }
    ],
    isPublic: true,
    creator: mockUsers[0],
    usageCount: 156,
    tags: ['人事', '请假', '审批']
  },
  {
    id: '2',
    name: '采购申请流程',
    description: '公司采购物品的申请流程',
    category: '采购管理',
    steps: [
      {
        name: '需求确认',
        description: '确认采购需求和预算',
        order: 1
      },
      {
        name: '供应商比较',
        description: '比较不同供应商报价',
        order: 2
      },
      {
        name: '财务审批',
        description: '财务部门审批采购预算',
        order: 3
      },
      {
        name: '执行采购',
        description: '执行采购订单',
        order: 4
      }
    ],
    isPublic: true,
    creator: mockUsers[0],
    usageCount: 89,
    tags: ['采购', '财务', '审批']
  }
]

// 导出所有数据的默认值
export const mockData = {
  users: mockUsers,
  tasks: mockTasks,
  workflows: mockWorkflows,
  dashboardStats: mockDashboardStats,
  quickActions: mockQuickActions,
  messages: mockMessages,
  workflowTemplates: mockWorkflowTemplates
}

// 状态选项配置
export const statusOptions = [
  { label: '待处理', value: 'pending', color: '#faad14' },
  { label: '进行中', value: 'in_progress', color: '#1890ff' },
  { label: '待审核', value: 'review', color: '#722ed1' },
  { label: '已完成', value: 'completed', color: '#52c41a' },
  { label: '已取消', value: 'cancelled', color: '#ff4d4f' }
]

export const priorityOptions = [
  { label: '低', value: 'low', color: '#52c41a' },
  { label: '中', value: 'medium', color: '#faad14' },
  { label: '高', value: 'high', color: '#ff7a45' },
  { label: '紧急', value: 'urgent', color: '#ff4d4f' }
]

// 配色方案
export const colorScheme = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#ff4d4f',
  info: '#13c2c2',
  text: '#333333',
  textSecondary: '#666666',
  border: '#d9d9d9',
  background: '#f8f9fa',
  backgroundSecondary: '#ffffff'
} 