import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'
import MobileLayout from '@/components/layout/MobileLayout'
import WorkflowOverview from '@/components/business/WorkflowOverview'
import QuickActions from '@/components/business/QuickActions'
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
          <WorkflowOverview stats={stats} />
          <QuickActions onActionClick={handleQuickActionClick} />
        </View>
      </PullToRefresh>
    </MobileLayout>
  )
}

export default Index 