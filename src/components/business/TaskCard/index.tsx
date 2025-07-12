import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { CheckNormal, Clock, Notice, Warning } from '@nutui/icons-react-taro'
import { Task } from '@/types'
import './index.scss'

interface TaskCardProps {
  task: Task
  onClick?: (task: Task) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { 
        text: '待处理', 
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: <Clock size={12} />
      },
      in_progress: { 
        text: '进行中', 
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        icon: <Notice size={12} />
      },
      completed: { 
        text: '已完成', 
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: <CheckNormal size={12} />
      },
      cancelled: { 
        text: '已拒绝', 
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: <Warning size={12} />
      }
    }
    return statusMap[status] || { 
      text: '未知', 
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      icon: <Clock size={12} />
    }
  }

  const getPriorityInfo = (priority: string) => {
    const priorityMap = {
      low: { text: '低', color: '#10b981' },
      medium: { text: '中', color: '#f59e0b' },
      high: { text: '高', color: '#ef4444' }
    }
    return priorityMap[priority] || { text: '中', color: '#f59e0b' }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  }

  const handleCardClick = () => {
    onClick?.(task)
  }

  const statusInfo = getStatusInfo(task.status)
  const priorityInfo = getPriorityInfo(task.priority)
  const progressPercentage = Math.round((task.workflow.currentStep / task.workflow.totalSteps) * 100)

  return (
    <View className="task-card" onClick={handleCardClick}>
      {/* 卡片头部 */}
      <View className="task-card__header">
        <View className="task-card__left">
          <Text className="task-card__title">{task.title}</Text>
          <View className="task-card__meta">
            <View 
              className="task-card__status"
              style={{
                color: statusInfo.color,
                backgroundColor: statusInfo.bgColor
              }}
            >
              {statusInfo.icon}
              <Text className="task-card__status-text">{statusInfo.text}</Text>
            </View>
            <Text 
              className="task-card__priority"
              style={{ color: priorityInfo.color }}
            >
              {priorityInfo.text}优先级
            </Text>
          </View>
        </View>
        <View className="task-card__right">
          <Image
            src={task.assignee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
            className="task-card__avatar"
            mode="aspectFill"
          />
        </View>
      </View>

      {/* 任务描述 */}
      <Text className="task-card__description">{task.description}</Text>

      {/* 工作流程进度 */}
      <View className="task-card__progress-section">
        <View className="task-card__progress-info">
          <Text className="task-card__progress-text">
            {task.workflow.stepName} ({task.workflow.currentStep}/{task.workflow.totalSteps})
          </Text>
        </View>
        <View className="task-card__progress-bar">
          <View 
            className="task-card__progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </View>

      {/* 卡片底部 */}
      <View className="task-card__footer">
        <Text className="task-card__due-date">
          截止：{formatDate(task.dueDate)}
        </Text>
        <Text className="task-card__assignee-name">
          {task.assignee.name}
        </Text>
      </View>
    </View>
  )
}

export default TaskCard 