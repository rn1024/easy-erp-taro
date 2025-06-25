import React from 'react'
import { View, Text } from '@tarojs/components'
import { Avatar, Progress } from '@nutui/nutui-react-taro'
import { Clock, Warning } from '@nutui/icons-react-taro'
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
}

/**
 * 任务卡片组件
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskClick,
  className
}) => {

  // 获取状态显示信息
  const getStatusInfo = (status: TaskStatus) => {
    const statusMap = {
      pending: { text: '待处理', color: '#ffa500' },
      progress: { text: '进行中', color: '#576b95' },
      completed: { text: '已完成', color: '#07c160' },
      rejected: { text: '已拒绝', color: '#ff4757' },
      overdue: { text: '已逾期', color: '#ff4757' }
    }
    return statusMap[status] || statusMap.pending
  }

  // 获取优先级信息
  const getPriorityInfo = (priority: TaskPriority) => {
    const priorityMap = {
      high: { text: '高', color: '#ff4757' },
      medium: { text: '中', color: '#ffa500' },
      low: { text: '低', color: '#07c160' }
    }
    return priorityMap[priority]
  }

  // 计算工作流进度
  const getWorkflowProgress = () => {
    return Math.round((task.workflow.currentStep / task.workflow.totalSteps) * 100)
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
        month: 'numeric',
        day: 'numeric'
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
      className={cn('task-card', className)}
      onClick={() => onTaskClick?.(task)}
    >
      {/* 第一行：圆点 + 标题 + 警告图标 */}
      <View className="task-header">
        <View
          className="priority-dot"
          style={{ backgroundColor: priorityInfo.color }}
        />
        <Text className="task-title">{task.title}</Text>
        {isOverdue() && (
          <Warning
            size="16"
            color="#ff4757"
          />
        )}
      </View>

      {/* 第二行：描述 */}
      <Text className="task-description">{task.description}</Text>

      {/* 第三行：状态圆圈图标 + 状态文字 + 优先级 */}
      <View className="status-row">
        <View className="status-section">
          <View
            className="status-circle"
            style={{ borderColor: statusInfo.color }}
          >
            <View
              className="status-inner"
              style={{ backgroundColor: statusInfo.color }}
            />
          </View>
          <Text className="status-text">{statusInfo.text}</Text>
        </View>
        <Text className="priority-text">优先级: {priorityInfo.text}</Text>
      </View>

      {/* 第四行：责任人头像 + 姓名 + 时间 */}
      <View className="assignee-row">
        <View className="assignee-info">
          <Avatar
            size="24"
            src={task.assignee.avatar}
            className="assignee-avatar"
          >
            {task.assignee.name.slice(0, 1)}
          </Avatar>
          <Text className="assignee-name">{task.assignee.name}</Text>
        </View>

        <View className="due-date">
          <Clock size="12" color="#ff4757" />
          <Text className="due-date-text">{formatDueDate(task.dueDate)}</Text>
          {isOverdue() && <Warning size="12" color="#ff4757" />}
        </View>
      </View>

      {/* 第五行：进度条 + 步骤信息 + 查看详情 */}
      <View className="progress-row">
        <View className="progress-section">
          <Progress
            percentage={workflowProgress}
            strokeWidth="8"
            color="#576b95"
            style={{ width: '120px', marginBottom: '4px' }}
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
