import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { 
  Card, 
  Grid, 
  GridItem, 
  Tag, 
  Button
} from '@nutui/nutui-react-taro'
import { 
  Plus, 
  Service, 
  User, 
  Setting, 
  Clock, 
  CheckNormal,
  Notice,
  ArrowRight
} from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  steps: number
  estimatedTime: string
  category: string
  popularity: number
}

interface CreateWorkflowProps {
  onTemplateSelect?: (template: WorkflowTemplate) => void
}

const CreateWorkflow: React.FC<CreateWorkflowProps> = ({ onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)

  const templates: WorkflowTemplate[] = [
    {
      id: 'product_review',
      name: '产品需求评审',
      description: '新产品功能需求评审和技术方案确认流程',
      icon: Service,
      color: '#1890ff',
      bgColor: 'rgba(24, 144, 255, 0.1)',
      steps: 4,
      estimatedTime: '3-5天',
      category: 'product',
      popularity: 95
    },
    {
      id: 'design_approval',
      name: '设计方案审批',
      description: 'UI/UX设计方案审批和修改反馈流程',
      icon: Setting,
      color: '#722ed1',
      bgColor: 'rgba(114, 46, 209, 0.1)',
      steps: 3,
      estimatedTime: '2-3天',
      category: 'design',
      popularity: 88
    },
    {
      id: 'team_project',
      name: '团队协作项目',
      description: '多人协作项目管理和进度跟踪流程',
      icon: User,
      color: '#52c41a',
      bgColor: 'rgba(82, 196, 26, 0.1)',
      steps: 5,
      estimatedTime: '1-2周',
      category: 'collaboration',
      popularity: 92
    },
    {
      id: 'bug_fix',
      name: '问题修复流程',
      description: '软件缺陷报告、分配和修复验证流程',
      icon: Notice,
      color: '#f5222d',
      bgColor: 'rgba(245, 34, 45, 0.1)',
      steps: 4,
      estimatedTime: '1-3天',
      category: 'technical',
      popularity: 78
    },
    {
      id: 'content_review',
      name: '内容审核流程',
      description: '内容创作、审核和发布的完整流程',
      icon: CheckNormal,
      color: '#fa8c16',
      bgColor: 'rgba(250, 140, 22, 0.1)',
      steps: 3,
      estimatedTime: '1-2天',
      category: 'content',
      popularity: 85
    },
    {
      id: 'custom',
      name: '自定义流程',
      description: '根据具体需求创建自定义工作流程',
      icon: Plus,
      color: '#13c2c2',
      bgColor: 'rgba(19, 194, 194, 0.1)',
      steps: 0,
      estimatedTime: '自定义',
      category: 'custom',
      popularity: 100
    }
  ]

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'product', name: '产品' },
    { id: 'design', name: '设计' },
    { id: 'collaboration', name: '协作' },
    { id: 'technical', name: '技术' },
    { id: 'content', name: '内容' },
    { id: 'custom', name: '自定义' }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    if (template.id === 'custom') {
      // 跳转到自定义工作流构建器
      console.log('自定义工作流构建器开发中')
    } else {
      // 使用模板创建工作流
      if (onTemplateSelect) {
        onTemplateSelect(template)
      } else {
        // 跳转到工作流表单页面
        Taro.navigateTo({
          url: `/pages/workflowForm/index?templateId=${template.id}`
        })
      }
    }
  }

  const handleQuickStart = () => {
    if (selectedTemplate) {
      console.log(`正在创建${selectedTemplate.name}...`)
      // 模拟创建成功
      Taro.showToast({
        title: '创建成功',
        icon: 'success'
      })
    }
  }

  return (
    <View className="create-workflow">
      <View className="create-workflow__header">
        <View className="create-workflow__title">创建工作流</View>
        <View className="create-workflow__subtitle">选择合适的模板快速创建工作流程</View>
      </View>

      <View className="create-workflow__content">
        {/* 分类标签 */}
        <View className="create-workflow__categories">
          <View className="create-workflow__category-tabs">
            {categories.map(category => (
              <Tag
                key={category.id}
                className={`create-workflow__category-tag ${
                  selectedCategory === category.id ? 'create-workflow__category-tag--active' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
                background={selectedCategory === category.id ? '#1890ff' : '#f5f5f5'}
                color={selectedCategory === category.id ? '#fff' : '#666'}
              >
                {category.name}
              </Tag>
            ))}
          </View>
        </View>

        {/* 模板网格 */}
        <View className="create-workflow__templates">
          <View className="create-workflow__templates-grid">
            {filteredTemplates.map(template => {
              const Icon = template.icon
              return (
                <Card 
                  key={template.id}
                  className={`create-workflow__template-card ${
                    selectedTemplate?.id === template.id ? 'create-workflow__template-card--selected' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <View className="template-card__content">
                    <View className="template-card__header">
                      <View 
                        className="template-card__icon"
                        style={{ 
                          backgroundColor: template.bgColor,
                          color: template.color 
                        }}
                      >
                        <Icon size="20" />
                      </View>
                      
                      {template.popularity > 0 && (
                        <View className="template-card__popularity-badge">
                          热门 {template.popularity}%
                        </View>
                      )}
                    </View>
                    
                    <View className="template-card__info">
                      <View className="template-card__name">{template.name}</View>
                      <View className="template-card__desc">{template.description}</View>
                      
                      <View className="template-card__meta">
                        {template.steps > 0 && (
                          <View className="template-card__meta-item">
                            <CheckNormal size="12" />
                            <Text className="template-card__meta-text">{template.steps}步骤</Text>
                          </View>
                        )}
                        <View className="template-card__meta-item">
                          <Clock size="12" />
                          <Text className="template-card__meta-text">{template.estimatedTime}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View className="template-card__arrow">
                      <ArrowRight size="16" />
                    </View>
                  </View>
                </Card>
              )
            })}
          </View>
        </View>

        {/* 快速开始 */}
        {selectedTemplate && selectedTemplate.id !== 'custom' && (
          <View className="create-workflow__quick-start">
            <Card className="create-workflow__quick-start-card">
              <View className="create-workflow__quick-start-content">
                <View className="create-workflow__quick-start-title">快速开始</View>
                <View className="create-workflow__quick-start-desc">
                  使用"{selectedTemplate.name}"模板快速创建工作流程
                </View>
                <Button
                  className="create-workflow__quick-start-btn"
                  type="primary"
                  onClick={handleQuickStart}
                >
                  立即创建
                </Button>
              </View>
            </Card>
          </View>
        )}

        {/* 提示信息 */}
        <View className="create-workflow__tips">
          <View className="create-workflow__tips-title">💡 温馨提示</View>
          <View className="create-workflow__tips-list">
            <View className="create-workflow__tip-item">
              • 选择合适的模板可以快速搭建工作流程
            </View>
            <View className="create-workflow__tip-item">
              • 自定义流程支持灵活配置步骤和人员
            </View>
            <View className="create-workflow__tip-item">
              • 创建后可以随时修改和优化流程
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CreateWorkflow 