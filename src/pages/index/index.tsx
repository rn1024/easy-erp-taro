import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
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

interface QuickAction {
  id: string
  title: string
  description: string
  color: string
  bgColor: string
  iconName: string
}

const Index: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 24,
    completedTasks: 18,
    pendingTasks: 4,
    overdueTasks: 2,
    activeUsers: 3,
    completionRate: 75,
    avgCompletionTime: '3.5天',
    trend: 'up'
  })

  const actions: QuickAction[] = [
    {
      id: 'create_workflow',
      title: '创建工作流',
      description: '新建工作流程',
      color: '#07c160',
      bgColor: 'rgba(7, 193, 96, 0.1)',
      iconName: 'add'
    },
    {
      id: 'my_tasks',
      title: '我的任务',
      description: '查看待办事项',
      color: '#576b95',
      bgColor: 'rgba(87, 107, 149, 0.1)',
      iconName: 'assignment'
    },
    {
      id: 'pending_approval',
      title: '待审批',
      description: '处理审批事项',
      color: '#fa9d3b',
      bgColor: 'rgba(250, 157, 59, 0.1)',
      iconName: 'schedule'
    },
    {
      id: 'analytics',
      title: '数据分析',
      description: '查看工作报表',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      iconName: 'assessment'
    }
  ]

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

  const handleRefresh = async () => {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新统计数据
    setStats({
      ...stats,
      totalTasks: stats.totalTasks + 1,
      completionRate: Math.min(stats.completionRate + 2, 100)
    })
  }

  const handleQuickActionClick = (actionId: string) => {
    console.log('点击快速操作:', actionId)
    // 这里可以处理不同的快速操作
    switch (actionId) {
      case 'create_workflow':
        // 导航到创建工作流页面
        break
      case 'my_tasks':
        // 导航到我的任务页面
        break
      case 'pending_approval':
        // 导航到待审批页面
        break
      case 'analytics':
        // 导航到数据分析页面
        break
      default:
        break
    }
  }

  return (
    <MobileLayout className="index-page">
      <PullToRefresh
        onRefresh={handleRefresh}
        className="index-page__refresh"
      >
        <View className="index-page__content">
          {/* 工作流概览 */}
          <View className="index-page__workflow-overview">
            <View className="index-page__overview-container">
              <View className="index-page__overview-card">
                <Text className="index-page__overview-title">工作流概览</Text>
                
                {/* 统计卡片 */}
                <View className="index-page__overview-stats">
                  {statItems.map((item, index) => (
                    <View key={index} className="index-page__stat-item">
                      <View className="index-page__stat-header">
                        <View className="index-page__stat-icon" style={{ color: item.color }}>
                          <MaterialIcons 
                            name={item.iconName} 
                            size={24} 
                            color={item.color} 
                          />
                        </View>
                        <Text 
                          className="index-page__stat-value"
                          style={{ color: item.color }}
                        >
                          {item.value}
                        </Text>
                      </View>
                      <Text className="index-page__stat-label">{item.label}</Text>
                    </View>
                  ))}
                </View>

                {/* 完成率 */}
                <View className="index-page__completion">
                  <View className="index-page__completion-header">
                    <Text className="index-page__completion-label">完成率</Text>
                    <Text className="index-page__completion-value">
                      {stats.completionRate}%
                    </Text>
                  </View>
                  <View className="index-page__progress-bar">
                    <View 
                      className="index-page__progress-fill"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </View>
                </View>

                {/* 其他指标 */}
                <View className="index-page__metrics">
                  <View className="index-page__metric-item">
                    <View className="index-page__metric-header">
                      <View className="index-page__metric-icon">
                        <MaterialIcons 
                          name="people" 
                          size={20} 
                          color="#6b7280" 
                        />
                      </View>
                      <Text className="index-page__metric-label">活跃用户</Text>
                    </View>
                    <Text className="index-page__metric-value">{stats.activeUsers}</Text>
                  </View>
                  <View className="index-page__metric-item">
                    <View className="index-page__metric-header">
                      <View className="index-page__metric-icon">
                        <MaterialIcons 
                          name="timer" 
                          size={20} 
                          color="#6b7280" 
                        />
                      </View>
                      <Text className="index-page__metric-label">平均完成时间</Text>
                    </View>
                    <Text className="index-page__metric-value">{stats.avgCompletionTime}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 快速操作 */}
          <View className="index-page__quick-actions">
            <View className="index-page__actions-container">
              <View className="index-page__actions-card">
                <Text className="index-page__actions-title">快速操作</Text>
                <View className="index-page__actions-grid">
                  {actions.map((action) => (
                    <View
                      key={action.id}
                      className="index-page__action-item"
                      onClick={() => handleQuickActionClick(action.id)}
                    >
                      <View 
                        className="index-page__action-icon"
                        style={{ backgroundColor: action.bgColor, color: action.color }}
                      >
                        <MaterialIcons 
                          name={action.iconName} 
                          size={24} 
                          color={action.color} 
                        />
                      </View>
                      <View className="index-page__action-content">
                        <Text className="index-page__action-title">
                          {action.title}
                        </Text>
                        <Text className="index-page__action-description">
                          {action.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </PullToRefresh>
    </MobileLayout>
  )
}

export default Index 