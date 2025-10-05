import React from 'react';
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Users, 
  Settings, 
  Edit, 
  FileText 
} from 'lucide-react';

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface QuickActionsProps {
  onActionClick: (actionId: string) => void
}

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'create_workflow',
      title: '创建工作流',
      description: '新建工作流程',
      icon: <Plus size={20} />,
      color: '#07c160',
      bgColor: 'rgba(7, 193, 96, 0.1)'
    },
    {
      id: 'my_tasks',
      title: '我的任务',
      description: '查看待办事项',
      icon: <CheckSquare size={20} />,
      color: '#576b95',
      bgColor: 'rgba(87, 107, 149, 0.1)'
    },
    {
      id: 'pending_approval',
      title: '待审批',
      description: '处理审批事项',
      icon: <Clock size={20} />,
      color: '#fa9d3b',
      bgColor: 'rgba(250, 157, 59, 0.1)'
    },
    {
      id: 'analytics',
      title: '数据分析',
      description: '查看工作报表',
      icon: <BarChart3 size={20} />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 'team_management',
      title: '团队管理',
      description: '管理团队成员',
      icon: <Users size={20} />,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      id: 'system_settings',
      title: '系统设置',
      description: '配置系统参数',
      icon: <Settings size={20} />,
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)'
    },
    {
      id: 'form_example',
      title: '表单示例',
      description: '查看表单组件',
      icon: <Edit size={20} />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      id: 'api_docs',
      title: 'API文档',
      description: '开发者文档',
      icon: <FileText size={20} />,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  const handleActionClick = (actionId: string) => {
    onActionClick(actionId)
  }

  return (
    <div className="mt-4">
      <div className="px-4">
        <div className="bg-white rounded-lg p-4 my-2 shadow-sm">
          <h3 className="text-base font-medium text-gray-900 mb-3">快速操作</h3>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className="p-3 bg-gray-50 rounded-lg border-none flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: action.bgColor, color: action.color }}
                >
                  {action.icon}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-0.5">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}