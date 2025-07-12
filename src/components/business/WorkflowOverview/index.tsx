import React from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

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

const WorkflowOverview: React.FC<WorkflowOverviewProps> = ({ stats }) => {
  const statItems = [
    {
      label: '总任务',
      value: stats.totalTasks,
      color: '#3b82f6',
      iconName: 'assignment'
    },
    {
      label: '已完成',
      value: stats.completedTasks,
      color: '#10b981',
      iconName: 'done'
    },
    {
      label: '待处理',
      value: stats.pendingTasks,
      color: '#f59e0b',
      iconName: 'schedule'
    },
    {
      label: '已逾期',
      value: stats.overdueTasks,
      color: '#ef4444',
      iconName: 'warning'
    }
  ]

  return (
    <View className="workflow-overview">
      <View className="workflow-overview__container">
        <View className="workflow-overview__card">
          <Text className="workflow-overview__title">工作流概览</Text>
          
          {/* 统计卡片 */}
          <View className="workflow-overview__stats">
            {statItems.map((item, index) => (
              <View key={index} className="workflow-overview__stat-item">
                <View className="workflow-overview__stat-header">
                  <View className="workflow-overview__stat-icon" style={{ color: item.color }}>
                    <MaterialIcons 
                      name={item.iconName} 
                      size={16} 
                      color={item.color} 
                    />
                  </View>
                  <Text 
                    className="workflow-overview__stat-value"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </Text>
                </View>
                <Text className="workflow-overview__stat-label">{item.label}</Text>
              </View>
            ))}
          </View>

          {/* 完成率 */}
          <View className="workflow-overview__completion">
            <View className="workflow-overview__completion-header">
              <Text className="workflow-overview__completion-label">完成率</Text>
              <Text className="workflow-overview__completion-value">
                {stats.completionRate}%
              </Text>
            </View>
            <View className="workflow-overview__progress-bar">
              <View 
                className="workflow-overview__progress-fill"
                style={{ width: `${stats.completionRate}%` }}
              />
            </View>
          </View>

          {/* 其他指标 */}
          <View className="workflow-overview__metrics">
            <View className="workflow-overview__metric-item">
              <View className="workflow-overview__metric-header">
                <View className="workflow-overview__metric-icon">
                  <MaterialIcons 
                    name="people" 
                    size={14} 
                    color="#6b7280" 
                  />
                </View>
                <Text className="workflow-overview__metric-label">活跃用户</Text>
              </View>
              <Text className="workflow-overview__metric-value">{stats.activeUsers}</Text>
            </View>
            <View className="workflow-overview__metric-item">
              <View className="workflow-overview__metric-header">
                <View className="workflow-overview__metric-icon">
                  <MaterialIcons 
                    name="timer" 
                    size={14} 
                    color="#6b7280" 
                  />
                </View>
                <Text className="workflow-overview__metric-label">平均完成时间</Text>
              </View>
              <Text className="workflow-overview__metric-value">{stats.avgCompletionTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default WorkflowOverview 