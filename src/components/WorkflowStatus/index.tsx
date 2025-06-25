import React from 'react'
import { View, Text } from '@tarojs/components'
import { CheckNormal, Clock, Warning } from '@nutui/icons-react-taro'
import { cn } from '../../utils/cn'
import './index.scss'

// 工作流步骤状态
export type WorkflowStepStatus = 'completed' | 'current' | 'pending' | 'rejected'

// 工作流步骤接口
export interface WorkflowStep {
  id: string
  name: string
  status: WorkflowStepStatus
  description?: string
  assignee?: {
    name: string
    avatar?: string
  }
  completedAt?: string
  estimatedTime?: string
  order: number
}

interface WorkflowStatusProps {
  /** 工作流步骤数组 */
  steps: WorkflowStep[]
  /** 组件标题 */
  title?: string
  /** 是否显示垂直布局 */
  vertical?: boolean
  /** 是否显示详细信息 */
  showDetails?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 步骤点击回调 */
  onStepClick?: (step: WorkflowStep) => void
}

/**
 * 工作流状态组件
 * 展示工作流的步骤状态和进度，支持水平和垂直布局
 */
const WorkflowStatus: React.FC<WorkflowStatusProps> = ({
  steps,
  title,
  vertical = false,
  showDetails = true,
  className,
  onStepClick
}) => {

  // 获取步骤状态图标
  const getStatusIcon = (status: WorkflowStepStatus) => {
    const iconProps = { size: "16" }

    switch (status) {
      case 'completed':
        return <CheckNormal {...iconProps} color="#07c160" />
      case 'current':
        return <Clock {...iconProps} color="#576b95" />
      case 'rejected':
        return <Warning {...iconProps} color="#ff4757" />
      case 'pending':
      default:
        return <View className="pending-dot" />
    }
  }

  // 获取步骤状态样式类名
  const getStatusClassName = (status: WorkflowStepStatus) => {
    return {
      'completed': status === 'completed',
      'current': status === 'current',
      'pending': status === 'pending',
      'rejected': status === 'rejected'
    }
  }

  // 格式化完成时间
  const formatCompletedTime = (timeStr?: string) => {
    if (!timeStr) return ''

    const date = new Date(timeStr)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return '今天完成'
    } else if (diffDays === 1) {
      return '昨天完成'
    } else if (diffDays < 7) {
      return `${diffDays}天前完成`
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      })
    }
  }

  // 计算总体完成进度
  const getOverallProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length
    return Math.round((completedSteps / steps.length) * 100)
  }

  const overallProgress = getOverallProgress()

  return (
    <View className={cn('workflow-status', className, {
      'vertical': vertical,
      'horizontal': !vertical
    })}>

      {/* 标题和进度 */}
      {title && (
        <View className="workflow-header">
          <Text className="workflow-title">{title}</Text>
          <Text className="workflow-progress-text">
            {overallProgress}% 完成
          </Text>
        </View>
      )}

      {/* 步骤列表 */}
      <View className="workflow-steps">
        {steps.map((step, index) => (
          <View
            key={step.id}
            className={cn('workflow-step', getStatusClassName(step.status), {
              'clickable': !!onStepClick
            })}
            onClick={() => onStepClick?.(step)}
          >

            {/* 步骤连接线 (垂直布局) */}
            {vertical && index > 0 && (
              <View className="step-connector" />
            )}

            {/* 步骤图标 */}
            <View className="step-icon-container">
              <View className="step-icon">
                {getStatusIcon(step.status)}
              </View>

              {/* 步骤编号 */}
              <Text className="step-number">{step.order}</Text>
            </View>

            {/* 步骤信息 */}
            <View className="step-content">
              <View className="step-main">
                <Text className="step-name">{step.name}</Text>

                {/* 步骤状态文本 */}
                <View className="step-status-info">
                  {step.status === 'completed' && step.completedAt && (
                    <Text className="status-text completed">
                      {formatCompletedTime(step.completedAt)}
                    </Text>
                  )}
                  {step.status === 'current' && (
                    <Text className="status-text current">
                      进行中
                    </Text>
                  )}
                  {step.status === 'pending' && step.estimatedTime && (
                    <Text className="status-text pending">
                      预计 {step.estimatedTime}
                    </Text>
                  )}
                  {step.status === 'rejected' && (
                    <Text className="status-text rejected">
                      已拒绝
                    </Text>
                  )}
                </View>
              </View>

              {/* 详细信息 */}
              {showDetails && (
                <View className="step-details">
                  {step.description && (
                    <Text className="step-description">
                      {step.description}
                    </Text>
                  )}

                  {step.assignee && (
                    <Text className="step-assignee">
                      负责人: {step.assignee.name}
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* 水平布局连接线 */}
            {!vertical && index < steps.length - 1 && (
              <View className="step-connector-horizontal" />
            )}
          </View>
        ))}
      </View>

      {/* 总体进度条 (仅垂直布局显示) */}
      {vertical && title && (
        <View className="overall-progress">
          <View className="progress-bar">
            <View
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </View>
          <Text className="progress-text">
            已完成 {steps.filter(s => s.status === 'completed').length} / {steps.length} 步骤
          </Text>
        </View>
      )}
    </View>
  )
}

export default WorkflowStatus
