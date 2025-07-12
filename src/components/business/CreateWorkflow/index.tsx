import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { 
  Tag, 
  Button,
  NavBar
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import './index.scss'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  bgColor: string
  steps: number
  estimatedTime: string
  category: string
  popularity: number
}

interface CreateWorkflowProps {
  onTemplateSelect?: (template: WorkflowTemplate) => void
  onBack?: () => void
}

const CreateWorkflow: React.FC<CreateWorkflowProps> = ({ onTemplateSelect, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)

  const templates: WorkflowTemplate[] = [
    {
      id: 'product_review',
      name: '产品需求评审',
      description: '新产品功能需求评审和技术方案确认流程',
      icon: 'build',
      color: '#1890ff',
      bgColor: '#e6f7ff',
      steps: 4,
      estimatedTime: '3-5天',
      category: '产品',
      popularity: 95
    },
    {
      id: 'design_approval',
      name: '设计方案审批',
      description: 'UI/UX设计方案审批和修改反馈流程',
      icon: 'settings',
      color: '#722ed1',
      bgColor: '#f9f0ff',
      steps: 3,
      estimatedTime: '2-3天',
      category: '设计',
      popularity: 88
    },
    {
      id: 'team_project',
      name: '团队协作项目',
      description: '多人协作项目管理和进度跟踪流程',
      icon: 'person',
      color: '#52c41a',
      bgColor: '#f6ffed',
      steps: 5,
      estimatedTime: '1-2周',
      category: '协作',
      popularity: 92
    },
    {
      id: 'bug_fix',
      name: '问题修复流程',
      description: '软件缺陷报告、分配和修复验证流程',
      icon: 'notifications',
      color: '#f5222d',
      bgColor: '#fff2f0',
      steps: 4,
      estimatedTime: '1-3天',
      category: '技术',
      popularity: 78
    },
    {
      id: 'content_review',
      name: '内容审核流程',
      description: '内容创作、审核和发布的完整流程',
      icon: 'check',
      color: '#fa8c16',
      bgColor: '#fff7e6',
      steps: 3,
      estimatedTime: '1-2天',
      category: '内容',
      popularity: 85
    },
    {
      id: 'custom',
      name: '自定义流程',
      description: '根据具体需求创建自定义工作流程',
      icon: 'add',
      color: '#666666',
      bgColor: '#f5f5f5',
      steps: 0,
      estimatedTime: '自定义',
      category: '其他',
      popularity: 0
    }
  ]

  const categories = ['全部', '产品', '设计', '协作', '技术', '内容', '其他']

  const filteredTemplates = selectedCategory === '全部' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    if (template.id === 'custom') {
      // 跳转到自定义工作流构建器
      Taro.showToast({
        title: '自定义工作流开发中',
        icon: 'none'
      })
    } else {
      // 使用模板创建工作流
      if (onTemplateSelect) {
        onTemplateSelect(template)
      } else {
        // 显示创建成功提示
        Taro.showToast({
          title: '模板已选择',
          icon: 'success'
        })
      }
    }
  }

  const handleQuickStart = () => {
    if (selectedTemplate) {
      Taro.showToast({
        title: `创建${selectedTemplate.name}成功`,
        icon: 'success'
      })
      // 延迟返回上一页
      setTimeout(() => {
        if (onBack) {
          onBack()
        } else {
          Taro.navigateBack()
        }
      }, 1500)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className="create-workflow">
      <View className="create-workflow__content">
        {/* 分类选择 */}
        <View className="create-workflow__categories">
          <View className="create-workflow__category-tabs">
            {categories.map(category => (
              <View
                key={category}
                className={`create-workflow__category-tag ${
                  selectedCategory === category ? 'create-workflow__category-tag--active' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </View>
            ))}
          </View>
        </View>

        {/* 模板列表 */}
        <View className="create-workflow__templates">
          <View className="create-workflow__templates-header">
            <Text className="create-workflow__templates-title">选择模板</Text>
          </View>
          
          <View className="create-workflow__templates-grid">
            {filteredTemplates.map(template => {
              return (
                <View 
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
                        <MaterialIcons name={template.icon} size={24} color={template.color} />
                      </View>
                      
                      <View className="template-card__info">
                        <View className="template-card__name-row">
                          <Text className="template-card__name">{template.name}</Text>
                          {template.popularity > 0 && (
                            <View className="template-card__popularity-badge">
                              热门 {template.popularity}%
                            </View>
                          )}
                        </View>
                        
                        <Text className="template-card__desc">{template.description}</Text>
                        
                        <View className="template-card__meta">
                          {template.steps > 0 && (
                            <View className="template-card__meta-item">
                              <MaterialIcons name="check" size={12} color="#666" />
                              <Text className="template-card__meta-text">{template.steps}个步骤</Text>
                            </View>
                          )}
                          <View className="template-card__meta-item">
                            <MaterialIcons name="schedule" size={12} color="#666" />
                            <Text className="template-card__meta-text">{template.estimatedTime}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View className="template-card__arrow">
                        <MaterialIcons name="arrow_forward" size={16} color="#666" />
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 快速开始 */}
        {selectedTemplate && selectedTemplate.id !== 'custom' && (
          <View className="create-workflow__quick-start">
            <View className="create-workflow__quick-start-card">
              <View className="create-workflow__quick-start-content">
                <Text className="create-workflow__quick-start-title">快速开始</Text>
                <Text className="create-workflow__quick-start-desc">
                  使用"{selectedTemplate.name}"模板快速创建工作流程
                </Text>
                <Button
                  className="create-workflow__quick-start-btn"
                  type="primary"
                  onClick={handleQuickStart}
                >
                  立即创建
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default CreateWorkflow 