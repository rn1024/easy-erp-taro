import React from 'react'
import { View, Text } from '@tarojs/components'
import { Badge, Avatar, Progress } from '@nutui/nutui-react-taro'
import { Clock, User, Warning } from '@nutui/icons-react-taro'
import { cn } from '../../utils/cn'
import './index.scss'

// 任务状态类型
export type TaskStatus = 'pending' | 'progress' | 'completed' | 'rejected' | 'overdue'

// 优先级类型
export type TaskPriority = 'high' | 'medium' | 'low'

// 任务数据接口
export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee: {
    name: string
    avatar?: string
    id: string
  }
  dueDate: string
  workflow: {
    currentStep: number
    totalSteps: number
    stepName: string
  }
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface TaskCardProps {
  /** 任务数据对象 */
  task: Task
  /** 任务点击回调函数 */
  onTaskClick?: (task: Task) => void
  /** 自定义样式类名 */
  className?: string
  /** 是否显示详细信息 */
  showDetails?: boolean
}

/**
 * 任务卡片组件
 * 展示任务的完整信息，支持点击交互和状态显示
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskClick,
  className,
  showDetails = true
}) => {

  // 获取状态显示信息
  const getStatusInfo = (status: TaskStatus) => {
    const statusMap = {
      pending: { text: '待处理', color: '#999', bgColor: '#f5f5f5' },
      progress: { text: '进行中', color: '#576b95', bgColor: '#e8f0fe' },
      completed: { text: '已完成', color: '#07c160', bgColor: '#e8f7ee' },
      rejected: { text: '已拒绝', color: '#ff4757', bgColor: '#ffedef' },
      overdue: { text: '已逾期', color: '#ff6b35', bgColor: '#fff2f0' }
    }
    return statusMap[status] || statusMap.pending
  }

  // 获取优先级显示信息
  const getPriorityInfo = (priority: TaskPriority) => {
    const priorityMap = {
      high: { text: '高', color: '#ff4757', dotColor: '#ff4757' },
      medium: { text: '中', color: '#ffa500', dotColor: '#ffa500' },
      low: { text: '低', color: '#07c160', dotColor: '#07c160' }
    }
    return priorityMap[priority]
  }

  // 计算工作流进度
  const getWorkflowProgress = () => {
    return (task.workflow.currentStep / task.workflow.totalSteps) * 100
  }

  // 格式化时间显示
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `逾期 ${Math.abs(diffDays)} 天`
    } else if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '明天'
    } else if (diffDays <= 7) {
      return `${diffDays}天后`
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      })
    }
  }

  // 判断是否逾期
  const isOverdue = () => {
    return new Date(task.dueDate) < new Date() && task.status !== 'completed'
  }

  const statusInfo = getStatusInfo(task.status)
  const priorityInfo = getPriorityInfo(task.priority)
  const workflowProgress = getWorkflowProgress()

  return (
    <View
      className={cn('task-card', className, {
        'overdue': isOverdue(),
        'completed': task.status === 'completed'
      })}
      onClick={() => onTaskClick?.(task)}
    >
      {/* 标题行：圆点 + 标题 + 警告图标 */}
      <View className="task-title-row">
        <View
          className="priority-dot"
          style={{ backgroundColor: priorityInfo.dotColor }}
        />
        <Text className="task-title">{task.title}</Text>
        {isOverdue() && (
          <Warning
            size="16"
            color="#ff4757"
            className="warning-icon"
          />
        )}
      </View>

      {/* 任务描述 */}
      {task.description && (
        <Text className="task-description">{task.description}</Text>
      )}

      {/* 状态和优先级行 */}
      <View className="status-priority-row">
        <Badge
          value={statusInfo.text}
          style={{
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color,
          }}
          className="status-badge"
        />
        <Text className="priority-text">优先级: {priorityInfo.text}</Text>
      </View>

      {/* 责任人和时间行 */}
      <View className="assignee-time-row">
        <View className="assignee-info">
          <Avatar
            size="small"
            src={task.assignee.avatar}
            className="assignee-avatar"
          >
            {!task.assignee.avatar && task.assignee.name.slice(0, 1)}
          </Avatar>
          <Text className="assignee-name">{task.assignee.name}</Text>
        </View>

        <View className="time-info">
          <Clock size="12" color="#ff4757" />
          <Text className={cn('time-text', { 'overdue': isOverdue() })}>
            {formatDueDate(task.dueDate)}
          </Text>
          {isOverdue() && <Warning size="12" color="#ff4757" />}
        </View>
      </View>

      {/* 进度行 */}
      <View className="progress-row">
        <View className="progress-left">
          <Progress
            percentage={workflowProgress}
            strokeWidth="8"
            color="#576b95"
            className="task-progress"
          />
          <Text className="progress-text">
            {task.workflow.currentStep}/{task.workflow.totalSteps} {task.workflow.stepName}
          </Text>
        </View>
        <Text className="view-details">查看详情</Text>
      </View>
    </View>
  )
}

export default TaskCard
