import React from 'react';
import { 
  CheckSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Users,
  Timer
} from 'lucide-react';

interface Stats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  activeUsers: number
  completionRate: number
  avgCompletionTime: string
  trend: 'up' | 'down' | 'stable'
}

interface WorkflowOverviewProps {
  stats: Stats
}

export default function WorkflowOverview({ stats }: WorkflowOverviewProps) {
  const statItems = [
    {
      label: '总任务',
      value: stats.totalTasks,
      color: '#3b82f6',
      icon: <CheckSquare size={16} />
    },
    {
      label: '已完成',
      value: stats.completedTasks,
      color: '#10b981',
      icon: <CheckCircle size={16} />
    },
    {
      label: '待处理',
      value: stats.pendingTasks,
      color: '#f59e0b',
      icon: <Clock size={16} />
    },
    {
      label: '已逾期',
      value: stats.overdueTasks,
      color: '#ef4444',
      icon: <AlertCircle size={16} />
    }
  ]

  return (
    <div className="pt-4">
      <div className="px-4">
        <div className="bg-white rounded-lg p-4 my-2 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">工作流概览</h2>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {statItems.map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div 
                    className="text-2xl font-semibold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>

          {/* 完成率 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">完成率</span>
              <span className="text-base font-semibold text-green-600">
                {stats.completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>

          {/* 其他指标 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users size={14} className="text-blue-500" />
                <div className="text-xs text-gray-500">活跃用户</div>
              </div>
              <div className="text-sm font-semibold text-gray-900">{stats.activeUsers}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Timer size={14} className="text-purple-500" />
                <div className="text-xs text-gray-500">平均完成时间</div>
              </div>
              <div className="text-sm font-semibold text-gray-900">{stats.avgCompletionTime}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}