import React from 'react';
import { CheckCircle, Clock, AlertCircle, Timer } from 'lucide-react';

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'progress' | 'completed' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  assignee: {
    name: string
    avatar: string
  }
  dueDate: string
  createdAt: string
  workflow: {
    currentStep: number
    totalSteps: number
    stepName: string
  }
}

interface TaskCardProps {
  task: Task
  onTaskClick: (task: Task) => void
}

export default function TaskCard({ task, onTaskClick }: TaskCardProps) {
  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { 
        text: '待处理', 
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: <Clock size={12} />
      },
      progress: { 
        text: '进行中', 
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        icon: <Timer size={12} />
      },
      completed: { 
        text: '已完成', 
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: <CheckCircle size={12} />
      },
      rejected: { 
        text: '已拒绝', 
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: <AlertCircle size={12} />
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
    onTaskClick(task)
  }

  const statusInfo = getStatusInfo(task.status)
  const priorityInfo = getPriorityInfo(task.priority)

  return (
    <div 
      className="bg-white rounded-lg p-4 mb-3 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[0.98]"
      onClick={handleCardClick}
    >
      {/* 卡片头部 */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 mr-2">
          <h4 className="text-base font-medium text-gray-900 mb-1 leading-5">
            {task.title}
          </h4>
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
              style={{ 
                color: statusInfo.color,
                backgroundColor: statusInfo.bgColor
              }}
            >
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </div>
            <span 
              className="text-xs font-medium"
              style={{ color: priorityInfo.color }}
            >
              {priorityInfo.text}优先级
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
          />
        </div>
      </div>

      {/* 任务描述 */}
      <p className="text-xs text-gray-500 leading-5 mb-2">
        {task.description}
      </p>

      {/* 工作流程进度 */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">
            {task.workflow.stepName} ({task.workflow.currentStep}/{task.workflow.totalSteps})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(task.workflow.currentStep / task.workflow.totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* 卡片底部 */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          截止：{formatDate(task.dueDate)}
        </span>
        <span className="text-xs text-gray-900 font-medium">
          {task.assignee.name}
        </span>
      </div>
    </div>
  )
}