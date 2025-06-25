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

  // 获取优先级颜色
  const getPriorityColor = (priority: TaskPriority) => {
    const colorMap = {
      high: '#ff4757',
      medium: '#ffa500',
      low: '#07c160'
    }
    return colorMap[priority]
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
      return '今天截止'
    } else if (diffDays === 1) {
      return '明天截止'
    } else if (diffDays <= 7) {
      return `${diffDays} 天后截止`
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
  const workflowProgress = getWorkflowProgress()

  return (
    <View
      className={cn('task-card', className, {
        'overdue': isOverdue(),
        'completed': task.status === 'completed'
      })}
      onClick={() => onTaskClick?.(task)}
    >

      {/* 卡片头部 */}
      <View className="task-header">
        <View className="task-title-row">
          {/* 优先级指示器 */}
          <View
            className="priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          />

          {/* 任务标题 */}
          <Text className="task-title" numberOfLines={1}>
            {task.title}
          </Text>

          {/* 状态徽章 */}
          <Badge
            value={statusInfo.text}
            style={{
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color,
              border: `1rpx solid ${statusInfo.color}20`
            }}
            className="status-badge"
          />
        </View>

        {/* 任务描述 */}
        {task.description && showDetails && (
          <Text className="task-description" numberOfLines={2}>
            {task.description}
          </Text>
        )}
      </View>

      {/* 工作流进度 */}
      {showDetails && (
        <View className="workflow-section">
          <View className="workflow-info">
            <Text className="workflow-text">
              {task.workflow.stepName} ({task.workflow.currentStep}/{task.workflow.totalSteps})
            </Text>
          </View>
          <Progress
            percentage={workflowProgress}
            strokeWidth="8"
            color="#07c160"
            className="workflow-progress"
          />
        </View>
      )}

      {/* 卡片底部信息 */}
      <View className="task-footer">
        {/* 责任人信息 */}
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

        {/* 截止时间 */}
        <View className={cn('due-date', {
          'overdue': isOverdue(),
          'urgent': !isOverdue() && new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
        })}>
          <Clock size="12" />
          <Text className="due-date-text">
            {formatDueDate(task.dueDate)}
          </Text>
          {isOverdue() && <Warning size="12" />}
        </View>
      </View>

      {/* 标签 */}
      {task.tags && task.tags.length > 0 && showDetails && (
        <View className="task-tags">
          {task.tags.slice(0, 3).map((tag, index) => (
            <Text key={index} className="task-tag">
              {tag}
            </Text>
          ))}
          {task.tags.length > 3 && (
            <Text className="more-tags">+{task.tags.length - 3}</Text>
          )}
        </View>
      )}
    </View>
  )
}

export default TaskCard
