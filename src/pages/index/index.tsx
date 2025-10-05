import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { PageHeader, SectionCard, StatsGrid, InfoList } from '@/components/common'

/**
 * Types
 */
import type { StatsGridItem, InfoListItem } from '@/components/common'

import './index.scss'

interface Stats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  activeUsers: number
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

  const statItems: StatsGridItem[] = [
    {
      key: 'total',
      label: '总任务',
      value: stats.totalTasks,
      iconName: 'assignment',
      iconColor: '#3b82f6',
      valueColor: '#3b82f6'
    },
    {
      key: 'completed',
      label: '已完成',
      value: stats.completedTasks,
      iconName: 'done',
      iconColor: '#10b981',
      valueColor: '#10b981'
    },
    {
      key: 'pending',
      label: '待处理',
      value: stats.pendingTasks,
      iconName: 'schedule',
      iconColor: '#f59e0b',
      valueColor: '#f59e0b'
    },
    {
      key: 'overdue',
      label: '已逾期',
      value: stats.overdueTasks,
      iconName: 'warning',
      iconColor: '#ef4444',
      valueColor: '#ef4444'
    }
  ]

  const metricItems: StatsGridItem[] = [
    {
      key: 'activeUsers',
      label: '活跃用户',
      value: stats.activeUsers,
      iconName: 'people',
      iconColor: '#6b7280',
      variant: 'flat'
    },
    {
      key: 'avgTime',
      label: '平均完成时间',
      value: stats.avgCompletionTime,
      iconName: 'timer',
      iconColor: '#6b7280',
      variant: 'flat'
    }
  ]

  const handleRefresh = async () => {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新统计数据
    setStats({
      ...stats,
      totalTasks: stats.totalTasks + 1
    })
  }

  const _handleQuickActionClick = (actionId: string) => {
    // 点击快速操作: actionId
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

  const actionItems: InfoListItem[] = actions.map(action => ({
    key: action.id,
    label: action.title,
    value: action.description,
    iconName: action.iconName,
    iconColor: action.color
  }))

  return (
    <MobileLayout className='index-page'>
      <PullToRefresh onRefresh={handleRefresh}>
        <View className='index-page__wrapper'>
          <PageHeader
            title='工作流概览'
            description='实时掌握团队任务进度与整体表现'
            meta={(
              <Text>
                趋势：{stats.trend === 'up' ? '上升' : stats.trend === 'down' ? '下降' : '稳定'}
              </Text>
            )}
            compact
          >
            <StatsGrid items={statItems} />
          </PageHeader>

          <SectionCard
            title='关键指标'
            description='核心团队运行指标概览'
            compact
          >
            <StatsGrid items={metricItems} singleColumn={metricItems.length < 3} />
          </SectionCard>

          <SectionCard
            title='快速操作'
            description='常用功能入口'
            compact
          >
            <InfoList
              items={actionItems}
              columns={2}
              itemClassName='index-page__action-item'
            />
          </SectionCard>
        </View>
      </PullToRefresh>
    </MobileLayout>
  )
}

export default Index 
