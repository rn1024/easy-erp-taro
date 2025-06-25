import type { OverviewStats, Task, WorkflowStep } from '../components'

/**
 * 模拟统计数据
 */
export const mockStats: OverviewStats = {
  totalTasks: 24,
  completedTasks: 18,
  pendingTasks: 4,
  overdueTasks: 2,
  activeUsers: 12,
  completionRate: 75,
  avgCompletionTime: '2.5天',
  overallProgress: 75,
  trend: 'up'
}

/**
 * 模拟任务数据
 */
export const mockTasks: Task[] = [
  {
    id: '1',
    title: '产品需求评审',
    description: '对新版本功能需求进行详细评审，确认技术可行性和业务价值',
    status: 'progress',
    priority: 'high',
    assignee: {
      id: '1',
      name: '张三',
      avatar: ''
    },
    dueDate: '2024-12-28T00:00:00.000Z',
    workflow: {
      currentStep: 2,
      totalSteps: 4,
      stepName: '需求分析'
    },
    tags: ['产品', '评审', '高优先级'],
    createdAt: '2024-12-20T00:00:00.000Z',
    updatedAt: '2024-12-24T00:00:00.000Z'
  },
  {
    id: '2',
    title: '设计方案审批',
    description: 'UI设计稿和交互流程的最终确认',
    status: 'pending',
    priority: 'medium',
    assignee: {
      id: '2',
      name: '李四',
      avatar: ''
    },
    dueDate: '2024-12-26T00:00:00.000Z',
    workflow: {
      currentStep: 1,
      totalSteps: 3,
      stepName: '设计评审'
    },
    tags: ['设计', '审批'],
    createdAt: '2024-12-22T00:00:00.000Z',
    updatedAt: '2024-12-23T00:00:00.000Z'
  },
  {
    id: '3',
    title: '代码重构优化',
    description: '对核心模块代码进行重构，提升性能和可维护性',
    status: 'overdue',
    priority: 'high',
    assignee: {
      id: '3',
      name: '王五',
      avatar: ''
    },
    dueDate: '2024-12-22T00:00:00.000Z',
    workflow: {
      currentStep: 2,
      totalSteps: 4,
      stepName: '代码实现'
    },
    tags: ['开发', '重构', '优化'],
    createdAt: '2024-12-18T00:00:00.000Z',
    updatedAt: '2024-12-22T00:00:00.000Z'
  },
  {
    id: '4',
    title: '用户反馈处理',
    description: '收集并分析用户反馈，制定改进方案',
    status: 'completed',
    priority: 'low',
    assignee: {
      id: '4',
      name: '赵六',
      avatar: ''
    },
    dueDate: '2024-12-25T00:00:00.000Z',
    workflow: {
      currentStep: 3,
      totalSteps: 3,
      stepName: '已完成'
    },
    tags: ['用户反馈', '分析'],
    createdAt: '2024-12-15T00:00:00.000Z',
    updatedAt: '2024-12-24T00:00:00.000Z'
  }
]

/**
 * 模拟工作流步骤数据
 */
export const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: '1',
    name: '需求提交',
    status: 'completed',
    description: '提交详细的需求文档和功能说明',
    assignee: {
      name: '产品经理',
      avatar: ''
    },
    completedAt: '2024-12-20T10:30:00.000Z',
    order: 1
  },
  {
    id: '2',
    name: '技术评审',
    status: 'completed',
    description: '技术团队评估实现方案和资源投入',
    assignee: {
      name: '技术负责人',
      avatar: ''
    },
    completedAt: '2024-12-21T14:20:00.000Z',
    order: 2
  },
  {
    id: '3',
    name: '开发实现',
    status: 'current',
    description: '按照技术方案进行功能开发',
    assignee: {
      name: '开发工程师',
      avatar: ''
    },
    estimatedTime: '3-5天',
    order: 3
  },
  {
    id: '4',
    name: '测试验收',
    status: 'pending',
    description: '功能测试和质量验收',
    assignee: {
      name: '测试工程师',
      avatar: ''
    },
    estimatedTime: '1-2天',
    order: 4
  }
]

/**
 * 快速操作模拟数据
 */
export const mockQuickActions = [
  {
    id: 'create_workflow',
    title: '创建流程',
    description: '快速创建新的工作流程'
  },
  {
    id: 'my_tasks',
    title: '我的任务',
    description: '查看分配给我的任务',
    count: 8
  }
]

/**
 * 获取模拟数据的工具函数
 */
export const getMockData = () => ({
  stats: mockStats,
  tasks: mockTasks,
  workflowSteps: mockWorkflowSteps,
  quickActions: mockQuickActions
})

/**
 * 模拟API延迟
 */
export const mockApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
