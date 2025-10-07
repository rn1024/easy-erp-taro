import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'

import MobileLayout from '@/components/MobileLayout'
import { Icon } from '@/components/common'

import './index.scss'

interface WorkflowStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  completionRate: number
  activeUsers: number
  avgCompletionTime: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  iconName: string
  route?: string
}

const Index: React.FC = () => {
  const [stats] = useState<WorkflowStats>({
    totalTasks: 24,
    completedTasks: 18,
    pendingTasks: 4,
    overdueTasks: 2,
    completionRate: 75,
    activeUsers: 12,
    avgCompletionTime: '2.5天'
  })

  const quickActions: QuickAction[] = [
    {
      id: 'create_workflow',
      title: '创建工作流',
      description: '新建工作流程',
      iconName: 'add',
      route: '/pages/workflow/create/index'
    },
    {
      id: 'my_tasks',
      title: '我的任务',
      description: '查看待办事项',
      iconName: 'assignment'
    },
    {
      id: 'pending_approval',
      title: '待审批',
      description: '处理审批事项',
      iconName: 'schedule'
    },
    {
      id: 'data_analysis',
      title: '数据分析',
      description: '查看工作报表',
      iconName: 'assessment'
    },
    {
      id: 'team_management',
      title: '团队管理',
      description: '管理团队成员',
      iconName: 'people'
    },
    {
      id: 'system_settings',
      title: '系统设置',
      description: '配置系统参数',
      iconName: 'settings'
    }
  ]

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleQuickAction = (action: QuickAction) => {
    if (action.route) {
      Taro.navigateTo({ url: action.route })
    } else {
      Taro.showToast({ title: `点击了${action.title}`, icon: 'none' })
    }
  }

  return (
    <MobileLayout className='index-page'>
      <PullToRefresh onRefresh={handleRefresh}>
        <View className='index-page__wrapper'>
          {/* 工作流概览 */}
          <View className='workflow-overview'>
            <Text className='workflow-overview__title'>工作流概览</Text>
            
            {/* 统计网格 2x2 */}
            <View className='workflow-overview__stats-grid'>
              <View className='stat-item stat-item--blue'>
                <Icon name='assignment' size={24} color='#3b82f6' />
                <Text className='stat-item__value'>{stats.totalTasks}</Text>
                <Text className='stat-item__label'>总任务</Text>
              </View>
              
              <View className='stat-item stat-item--green'>
                <Icon name='done' size={24} color='#10b981' />
                <Text className='stat-item__value'>{stats.completedTasks}</Text>
                <Text className='stat-item__label'>已完成</Text>
              </View>
              
              <View className='stat-item stat-item--orange'>
                <Icon name='schedule' size={24} color='#f59e0b' />
                <Text className='stat-item__value'>{stats.pendingTasks}</Text>
                <Text className='stat-item__label'>待处理</Text>
              </View>
              
              <View className='stat-item stat-item--red'>
                <Icon name='error' size={24} color='#ef4444' />
                <Text className='stat-item__value'>{stats.overdueTasks}</Text>
                <Text className='stat-item__label'>已逾期</Text>
              </View>
            </View>
            
            {/* 完成率 */}
            <View className='workflow-overview__completion'>
              <View className='completion-header'>
                <Text className='completion-label'>完成率</Text>
                <Text className='completion-percentage'>{stats.completionRate}%</Text>
              </View>
              <View className='completion-bar'>
                <View 
                  className='completion-fill' 
                  style={{ width: `${stats.completionRate}%` }}
                />
              </View>
            </View>
            
            {/* 底部指标 */}
            <View className='workflow-overview__metrics'>
              <View className='metric-item'>
                <Icon name='people' size={20} color='#3b82f6' />
                <View className='metric-content'>
                  <Text className='metric-label'>活跃用户</Text>
                  <Text className='metric-value'>{stats.activeUsers}</Text>
                </View>
              </View>
              
              <View className='metric-item'>
                <Icon name='schedule' size={20} color='#8b5cf6' />
                <View className='metric-content'>
                  <Text className='metric-label'>平均完成时间</Text>
                  <Text className='metric-value'>{stats.avgCompletionTime}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* 快速操作 */}
          <View className='quick-actions'>
            <Text className='quick-actions__title'>快速操作</Text>
            
            <View className='quick-actions__grid'>
              {quickActions.map((action) => (
                <View
                  key={action.id}
                  className='action-card'
                  onClick={() => handleQuickAction(action)}
                >
                  <Icon name={action.iconName} size={32} color='#3b82f6' />
                  <View className='action-card__content'>
                    <Text className='action-card__title'>{action.title}</Text>
                    <Text className='action-card__description'>{action.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </PullToRefresh>
    </MobileLayout>
  )
}

export default Index 
