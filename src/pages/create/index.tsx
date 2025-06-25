import React, { useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { Button, Steps, Card } from '@nutui/nutui-react-taro'
import { Plus, CheckNormal, Clock, User } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import {
  MobileLayout,
  BottomNavigation
} from '../../components'
import './index.scss'

// 工作流模板接口
interface WorkflowTemplate {
  id: string
  name: string
  description: string
  steps: number
  estimatedTime: string
  popularity: number
  category: string
  icon: string
}

const CreatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)

  // 工作流模板数据
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'product_review',
      name: '产品需求评审',
      description: '产品需求从提出到最终确认的完整评审流程',
      steps: 4,
      estimatedTime: '3-5天',
      popularity: 95,
      category: '产品',
      icon: '📋'
    },
    {
      id: 'design_approval',
      name: '设计方案审批',
      description: 'UI设计和交互方案的评审审批流程',
      steps: 3,
      estimatedTime: '2-3天',
      popularity: 88,
      category: '设计',
      icon: '🎨'
    },
    {
      id: 'code_review',
      name: '代码评审',
      description: '代码提交到合并的评审流程',
      steps: 3,
      estimatedTime: '1-2天',
      popularity: 92,
      category: '技术',
      icon: '💻'
    },
    {
      id: 'content_publish',
      name: '内容发布',
      description: '内容创作到发布的审核流程',
      steps: 4,
      estimatedTime: '2-4天',
      popularity: 76,
      category: '内容',
      icon: '📝'
    }
  ]

  // 创建步骤配置
  const createSteps = [
    { title: '选择模板', description: '选择工作流模板' },
    { title: '配置流程', description: '配置流程参数' },
    { title: '确认创建', description: '确认并创建工作流' }
  ]

  // 处理模板选择
  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setCurrentStep(1)
  }

  // 处理下一步
  const handleNextStep = () => {
    if (currentStep < createSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // 处理上一步
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 处理创建完成
  const handleCreateComplete = () => {
    Taro.showToast({
      title: '工作流创建成功',
      icon: 'success',
      duration: 2000
    })

    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
  }

  // 处理底部导航切换
  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        Taro.navigateBack()
        break
      case 'tasks':
        Taro.redirectTo({ url: '/pages/tasks/index' })
        break
      case 'messages':
        Taro.switchTab({ url: '/pages/messages/index' })
        break
      case 'profile':
        Taro.switchTab({ url: '/pages/profile/index' })
        break
      default:
        break
    }
  }

  // 渲染模板选择步骤
  const renderTemplateSelection = () => (
    <View className="template-selection">
      <View className="section-header">
        <Text className="section-title">选择工作流模板</Text>
        <Text className="section-desc">从预设模板快速开始，或创建自定义流程</Text>
      </View>

      <View className="template-grid">
        {workflowTemplates.map(template => (
          <Card
            key={template.id}
            className="template-card"
            onClick={() => handleTemplateSelect(template)}
          >
            <View className="template-content">
              <View className="template-icon">{template.icon}</View>
              <View className="template-info">
                <Text className="template-name">{template.name}</Text>
                <Text className="template-desc">{template.description}</Text>
                <View className="template-meta">
                  <View className="meta-item">
                    <CheckNormal size="12" />
                    <Text>{template.steps}步骤</Text>
                  </View>
                  <View className="meta-item">
                    <Clock size="12" />
                    <Text>{template.estimatedTime}</Text>
                  </View>
                </View>
              </View>
              <View className="template-popularity">
                {template.popularity}%
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View className="custom-option">
        <Card className="custom-card" onClick={() => setCurrentStep(1)}>
          <View className="custom-content">
            <Plus size="32" color="#576b95" />
            <Text className="custom-title">自定义流程</Text>
            <Text className="custom-desc">从头开始创建个性化工作流程</Text>
          </View>
        </Card>
      </View>
    </View>
  )

  // 渲染流程配置步骤
  const renderFlowConfiguration = () => (
    <View className="flow-configuration">
      <View className="section-header">
        <Text className="section-title">配置工作流程</Text>
        {selectedTemplate && (
          <Text className="section-desc">
            正在配置: {selectedTemplate.name}
          </Text>
        )}
      </View>

      <View className="config-form">
        <View className="form-group">
          <Text className="form-label">流程名称</Text>
          <View className="form-input">
            <Text className="input-placeholder">
              {selectedTemplate?.name || '请输入流程名称'}
            </Text>
          </View>
        </View>

        <View className="form-group">
          <Text className="form-label">责任人</Text>
          <View className="form-input">
            <User size="16" />
            <Text className="input-placeholder">选择责任人</Text>
          </View>
        </View>

        <View className="form-group">
          <Text className="form-label">预计完成时间</Text>
          <View className="form-input">
            <Clock size="16" />
            <Text className="input-placeholder">
              {selectedTemplate?.estimatedTime || '选择时间'}
            </Text>
          </View>
        </View>
      </View>

      <View className="step-actions">
        <Button
          className="action-btn secondary"
          onClick={handlePrevStep}
        >
          上一步
        </Button>
        <Button
          className="action-btn primary"
          onClick={handleNextStep}
        >
          下一步
        </Button>
      </View>
    </View>
  )

  // 渲染确认创建步骤
  const renderConfirmation = () => (
    <View className="confirmation">
      <View className="section-header">
        <Text className="section-title">确认创建</Text>
        <Text className="section-desc">请确认工作流程信息</Text>
      </View>

      <Card className="confirm-card">
        <View className="confirm-content">
          <View className="confirm-item">
            <Text className="confirm-label">流程名称</Text>
            <Text className="confirm-value">
              {selectedTemplate?.name || '自定义流程'}
            </Text>
          </View>
          <View className="confirm-item">
            <Text className="confirm-label">步骤数量</Text>
            <Text className="confirm-value">
              {selectedTemplate?.steps || 3}个步骤
            </Text>
          </View>
          <View className="confirm-item">
            <Text className="confirm-label">预计时间</Text>
            <Text className="confirm-value">
              {selectedTemplate?.estimatedTime || '待定'}
            </Text>
          </View>
        </View>
      </Card>

      <View className="step-actions">
        <Button
          className="action-btn secondary"
          onClick={handlePrevStep}
        >
          上一步
        </Button>
        <Button
          className="action-btn primary"
          onClick={handleCreateComplete}
        >
          创建工作流
        </Button>
      </View>
    </View>
  )

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderTemplateSelection()
      case 1:
        return renderFlowConfiguration()
      case 2:
        return renderConfirmation()
      default:
        return renderTemplateSelection()
    }
  }

  return (
    <MobileLayout
      enableSafeArea
      className="create-page"
      footer={
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          messageCount={3}
        />
      }
    >
      <ScrollView
        className="create-scroll"
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className="create-content">
          {/* 步骤指示器 */}
          <View className="steps-wrapper">
            <Steps
              current={currentStep}
              direction="horizontal"
              className="create-steps"
            >
              {createSteps.map((step, index) => (
                <Steps.Item
                  key={index}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </Steps>
          </View>

          {/* 步骤内容 */}
          <View className="step-content">
            {renderStepContent()}
          </View>

          {/* 底部安全区域占位 */}
          <View className="bottom-spacer" />
        </View>
      </ScrollView>
    </MobileLayout>
  )
}

export default CreatePage
