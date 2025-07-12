import React from 'react'
import { View } from '@tarojs/components'
import { Tag, Avatar } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import { Workflow, WorkflowStep } from '@/types'
import './index.scss'

interface WorkflowStatusProps {
  workflow: Workflow
  className?: string
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({
  workflow,
  className = ''
}) => {


  // 获取步骤图标
  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <MaterialIcons name="check" size={12} color="#52c41a" />
      case 'active':
        return <MaterialIcons name="schedule" size={12} color="#1890ff" />
      case 'skipped':
        return <MaterialIcons name="close" size={12} color="#ff4d4f" />
      default:
        return null
    }
  }



  return (
    <View className={`workflow-status ${className}`}>
      <View className="workflow-status__header">
        <View className="workflow-status__title">
          <View className="workflow-status__name">{workflow.name}</View>
          <Tag 
            className="workflow-status__tag"
            background={
              workflow.status === 'completed' ? '#f6ffed' : 
              workflow.status === 'active' ? '#e6f7ff' :
              workflow.status === 'paused' ? '#fff2e8' : '#f5f5f5'
            }
            color={
              workflow.status === 'completed' ? '#52c41a' : 
              workflow.status === 'active' ? '#1890ff' :
              workflow.status === 'paused' ? '#fa8c16' : '#8c8c8c'
            }
          >
            {workflow.status === 'completed' ? '已完成' : 
             workflow.status === 'active' ? '进行中' :
             workflow.status === 'paused' ? '已暂停' : 
             workflow.status === 'cancelled' ? '已取消' : '草稿'}
          </Tag>
        </View>
        <View className="workflow-status__description">
          {workflow.description}
        </View>
      </View>

      <View className="workflow-status__steps">
        <View className="workflow-status__steps-container">
          {workflow.steps.map((step, index) => (
            <View key={step.id} className={`workflow-status__step workflow-status__step--${step.status}`}>
              <View className="workflow-status__step-indicator">
                <View className="workflow-status__step-icon">
                  {getStepIcon(step) || (
                    <View className="workflow-status__step-number">{index + 1}</View>
                  )}
                </View>
                {index < workflow.steps.length - 1 && (
                  <View className="workflow-status__step-line" />
                )}
              </View>
              <View className="workflow-status__step-content">
                <View className="workflow-status__step-title">{step.name}</View>
                <View className="workflow-status__step-detail">
                  <View className="workflow-status__step-desc">
                    {step.description}
                  </View>
                  {step.assignee && (
                    <View className="workflow-status__step-assignee">
                      <Avatar 
                        size="24"
                        src={step.assignee.avatar}
                        className="workflow-status__assignee-avatar"
                      />
                      <View className="workflow-status__assignee-name">
                        {step.assignee.name}
                      </View>
                    </View>
                  )}
                  {step.dueDate && (
                    <View className="workflow-status__step-due">
                      截止: {new Date(step.dueDate).toLocaleDateString('zh-CN')}
                    </View>
                  )}
                  {step.completedAt && (
                    <View className="workflow-status__step-completed">
                      完成于: {new Date(step.completedAt).toLocaleDateString('zh-CN')}
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="workflow-status__footer">
        <View className="workflow-status__meta">
          <View className="workflow-status__creator">
            创建者: {workflow.creator.name}
          </View>
          <View className="workflow-status__dates">
            创建于: {new Date(workflow.createdAt).toLocaleDateString('zh-CN')}
          </View>
          <View className="workflow-status__category">
            分类: {workflow.category}
          </View>
        </View>
        {workflow.tags.length > 0 && (
          <View className="workflow-status__tags">
            {workflow.tags.map((tag, index) => (
              <Tag
                key={index}
                background="#f0f0f0"
                color="#666"
                className="workflow-status__tag-item"
              >
                {tag}
              </Tag>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

export default WorkflowStatus 