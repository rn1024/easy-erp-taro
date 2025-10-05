import React from 'react';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface WorkflowStep {
  id: string
  name: string
  status: 'completed' | 'current' | 'pending'
  assignee: {
    name: string
    avatar: string
  }
  completedAt?: string
  comment?: string
}

interface WorkflowStatusProps {
  steps: WorkflowStep[]
  title?: string
}

export default function WorkflowStatus({ steps, title = '工作流状态' }: WorkflowStatusProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  const getStepLineColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'current':
        return 'bg-blue-500'
      default:
        return 'bg-gray-300'
    }
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="bg-white">
      {title && (
        <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      )}
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            {/* 步骤图标 */}
            <div className="flex flex-col items-center">
              {getStepIcon(step.status)}
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${getStepLineColor(step.status)}`} />
              )}
            </div>
            
            {/* 步骤内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                {step.status === 'current' && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                    当前步骤
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={step.assignee.avatar}
                  alt={step.assignee.name}
                  className="w-6 h-6 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-xs text-gray-600">{step.assignee.name}</span>
              </div>
              
              {step.completedAt && (
                <div className="text-xs text-gray-400 mb-1">
                  完成时间: {formatTime(step.completedAt)}
                </div>
              )}
              
              {step.comment && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-1">
                  {step.comment}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}