import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { 
  Card, 
  Grid, 
  GridItem, 
  Tag, 
  Button
} from '@nutui/nutui-react-taro'
import { Plus } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
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

  const templates: WorkflowTemplate[] = [
    {
      id: 'product_review',
      name: '产品需求评审',
      description: '新产品功能需求评审和技术方案确认流程',
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

  const handleQuickStart = (template: WorkflowTemplate) => {
    console.log(`正在创建${template.name}...`)
    // 这里可以添加快速创建逻辑
  }

  return (
    <View className="create-workflow">
      <View className="create-workflow__header">
        <View className="create-workflow__title">创建工作流</View>
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
                background={selectedCategory === category.id ? '#1890ff' : '#f0f0f0'}
                color={selectedCategory === category.id ? '#fff' : '#666'}
              >
                {category.name}
              </Tag>
            ))}
          </View>
        </View>

        {/* 模板网格 */}
        <View className="create-workflow__templates">
          <Grid columns={2} gap={16}>
            {filteredTemplates.map(template => (
              <GridItem key={template.id}>
                <Card 
                  className="create-workflow__template-card"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <View className="template-card__content">
                    <View 
                      className="template-card__icon"
                      style={{ 
                        backgroundColor: template.bgColor,
                        color: template.color 
                      }}
                    >
                      {template.id === 'custom' ? <Plus size="24" /> : '📋'}
                    </View>
                    
                    <View className="template-card__info">
                      <View className="template-card__name">{template.name}</View>
                      <View className="template-card__desc">{template.description}</View>
                      
                      <View className="template-card__meta">
                        {template.steps > 0 && (
                          <Tag background="#f0f0f0" color="#666">
                            {template.steps}步骤
                          </Tag>
                        )}
                        <View className="template-card__time">{template.estimatedTime}</View>
                      </View>
                      
                      {template.popularity > 0 && (
                        <View className="template-card__popularity">
                          <View className="template-card__popularity-bar">
                            <View 
                              className="template-card__popularity-fill"
                              style={{ width: `${template.popularity}%` }}
                            />
                          </View>
                          <View className="template-card__popularity-text">
                            {template.popularity}% 用户推荐
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {template.id !== 'custom' && (
                    <View className="template-card__actions">
                      <Button
                        size="small"
                        fill="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleQuickStart(template)
                        }}
                      >
                        快速创建
                      </Button>
                    </View>
                  )}
                </Card>
              </GridItem>
            ))}
          </Grid>
        </View>

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