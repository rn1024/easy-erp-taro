import { create } from 'zustand'
import { WorkflowNode, WorkflowConnection } from '../components/CustomWorkflowBuilder'

// 工作流状态
export type WorkflowStatus = 'draft' | 'published' | 'running' | 'completed' | 'failed'

// 工作流接口
export interface Workflow {
  id: string
  name: string
  description?: string
  status: WorkflowStatus
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// 工作流执行记录
export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  currentNodeId?: string
  logs: Array<{
    nodeId: string
    timestamp: Date
    message: string
    type: 'info' | 'warning' | 'error'
  }>
}

// 工作流Store状态
interface WorkflowState {
  // 状态
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  executions: WorkflowExecution[]
  isLoading: boolean
  error: string | null

  // 操作
  setWorkflows: (workflows: Workflow[]) => void
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void

  // 执行相关
  startExecution: (workflowId: string) => string
  updateExecution: (executionId: string, updates: Partial<WorkflowExecution>) => void
  addExecutionLog: (executionId: string, log: WorkflowExecution['logs'][0]) => void

  // 工具方法
  getWorkflowById: (id: string) => Workflow | undefined
  getExecutionsByWorkflow: (workflowId: string) => WorkflowExecution[]
  clearError: () => void
}

// 创建工作流Store
export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // 初始状态
  workflows: [],
  currentWorkflow: null,
  executions: [],
  isLoading: false,
  error: null,

  // 设置工作流列表
  setWorkflows: (workflows) => {
    set({ workflows })
  },

  // 添加工作流
  addWorkflow: (workflow) => {
    set((state) => ({
      workflows: [...state.workflows, workflow]
    }))
  },

  // 更新工作流
  updateWorkflow: (id, updates) => {
    set((state) => ({
      workflows: state.workflows.map(wf =>
        wf.id === id ? { ...wf, ...updates, updatedAt: new Date() } : wf
      ),
      currentWorkflow: state.currentWorkflow?.id === id
        ? { ...state.currentWorkflow, ...updates, updatedAt: new Date() }
        : state.currentWorkflow
    }))
  },

  // 删除工作流
  deleteWorkflow: (id) => {
    set((state) => ({
      workflows: state.workflows.filter(wf => wf.id !== id),
      currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow
    }))
  },

  // 设置当前工作流
  setCurrentWorkflow: (workflow) => {
    set({ currentWorkflow: workflow })
  },

  // 开始执行
  startExecution: (workflowId) => {
    const executionId = `exec_${Date.now()}`
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'pending',
      startTime: new Date(),
      logs: []
    }

    set((state) => ({
      executions: [...state.executions, execution]
    }))

    return executionId
  },

  // 更新执行状态
  updateExecution: (executionId, updates) => {
    set((state) => ({
      executions: state.executions.map(exec =>
        exec.id === executionId ? { ...exec, ...updates } : exec
      )
    }))
  },

  // 添加执行日志
  addExecutionLog: (executionId, log) => {
    set((state) => ({
      executions: state.executions.map(exec =>
        exec.id === executionId
          ? { ...exec, logs: [...exec.logs, log] }
          : exec
      )
    }))
  },

  // 根据ID获取工作流
  getWorkflowById: (id) => {
    return get().workflows.find(wf => wf.id === id)
  },

  // 获取工作流的执行记录
  getExecutionsByWorkflow: (workflowId) => {
    return get().executions.filter(exec => exec.workflowId === workflowId)
  },

  // 清除错误
  clearError: () => {
    set({ error: null })
  }
}))
