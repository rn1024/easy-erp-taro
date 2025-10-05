import React, { useState } from 'react';
import { Plus, FileText, Users, Settings, ArrowRight, Clock, CheckSquare, Zap, ArrowLeft } from 'lucide-react';
import CustomWorkflowBuilder from './CustomWorkflowBuilder';
import MobileWorkflowForm from './MobileWorkflowForm';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  steps: number;
  estimatedTime: string;
  category: string;
  popularity: number;
}

interface CreateWorkflowProps {
  onBack?: () => void;
}

export default function CreateWorkflow({ onBack }: CreateWorkflowProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

  const templates: WorkflowTemplate[] = [
    {
      id: 'product_review',
      name: '产品需求评审',
      description: '新产品功能需求评审和技术方案确认流程',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      steps: 4,
      estimatedTime: '3-5天',
      category: '产品',
      popularity: 95
    },
    {
      id: 'design_approval',
      name: '设计方案审批',
      description: 'UI/UX设计方案审批和修改反馈流程',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      steps: 3,
      estimatedTime: '2-3天',
      category: '设计',
      popularity: 88
    },
    {
      id: 'team_project',
      name: '团队协作项目',
      description: '多人协作项目管理和进度跟踪流程',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      steps: 5,
      estimatedTime: '1-2周',
      category: '协作',
      popularity: 92
    },
    {
      id: 'bug_fix',
      name: '问题修复流程',
      description: '软件缺陷报告、分配和修复验证流程',
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      steps: 4,
      estimatedTime: '1-3天',
      category: '技术',
      popularity: 78
    },
    {
      id: 'content_review',
      name: '内容审核流程',
      description: '内容创作、审核和发布的完整流程',
      icon: CheckSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      steps: 3,
      estimatedTime: '1-2天',
      category: '内容',
      popularity: 85
    },
    {
      id: 'custom',
      name: '自定义流程',
      description: '根据具体需求创建自定义工作流程',
      icon: Plus,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      steps: 0,
      estimatedTime: '自定义',
      category: '其他',
      popularity: 0
    }
  ];

  const categories = ['全部', '产品', '设计', '协作', '技术', '内容', '其他'];
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredTemplates = selectedCategory === '全部' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    if (template.id === 'custom') {
      setShowCustomBuilder(true);
    }
  };

  const handleQuickStart = () => {
    if (selectedTemplate) {
      setShowMobileForm(true);
    }
  };

  // 如果正在显示自定义工作流程构建器，渲染它
  if (showCustomBuilder) {
    return (
      <CustomWorkflowBuilder 
        onBack={() => setShowCustomBuilder(false)}
        onSave={(workflow) => {
          console.log('Custom workflow created:', workflow);
          setShowCustomBuilder(false);
          if (onBack) onBack();
        }}
      />
    );
  }

  // 如果正在显示移动端表单，渲染它
  if (showMobileForm && selectedTemplate) {
    return (
      <MobileWorkflowForm
        template={selectedTemplate}
        onBack={() => {
          setShowMobileForm(false);
          setSelectedTemplate(null);
        }}
        onComplete={() => {
          setShowMobileForm(false);
          setSelectedTemplate(null);
          if (onBack) onBack();
        }}
      />
    );
  }

  return (
    <div className="pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          {onBack && (
            <button
              className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <h1 className="font-semibold text-gray-900">创建工作流程</h1>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              className={`whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 模板列表 */}
      <div className="px-4">
        <h2 className="font-medium text-gray-900 mb-3">选择模板</h2>
        <div className="grid gap-3">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div 
                key={template.id}
                className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg ${template.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${template.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      {template.popularity > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          热门 {template.popularity}%
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {template.steps > 0 && (
                          <div className="flex items-center gap-1">
                            <CheckSquare className="h-3 w-3" />
                            <span>{template.steps}个步骤</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{template.estimatedTime}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 快速开始 */}
      {selectedTemplate && selectedTemplate.id !== 'custom' && (
        <div className="px-4 py-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-base font-medium text-gray-900 mb-2">快速开始</h3>
            <p className="text-sm text-gray-600 mb-4">
              使用"{selectedTemplate.name}"模板快速创建工作流程
            </p>
            <button 
              className="w-full h-12 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              onClick={handleQuickStart}
            >
              立即创建
            </button>
          </div>
        </div>
      )}
    </div>
  );
}