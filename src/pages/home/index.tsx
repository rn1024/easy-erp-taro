import React, { useEffect } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  MobileLayout,
  BottomNavigation,
  WorkflowOverview,
  QuickActions
} from '../../components'
import { Plus, CheckNormal } from '@nutui/icons-react-taro'
import { getMockData } from '../../data/mockData'
import tabBarManager from '../../utils/tabBarManager'
import './index.scss'

const HomePage: React.FC = () => {

  // 获取模拟数据
  const { stats } = getMockData()

  useEffect(() => {
    // 初始化TabBar管理器
    tabBarManager.init()

    // 模拟设置消息数量
    tabBarManager.setMessageCount(3)
  }, [])

  // 处理快速操作点击
  const handleQuickActionClick = (actionId: string) => {
    console.log('点击快速操作:', actionId)

    switch (actionId) {
      case 'create_workflow':
        Taro.switchTab({ url: '/pages/create/index' })
        break
      case 'my_tasks':
        Taro.switchTab({ url: '/pages/tasks/index' })
        break
      case 'team_tasks':
        Taro.switchTab({ url: '/pages/tasks/index' })
        break
      case 'pending_approval':
        Taro.switchTab({ url: '/pages/tasks/index' })
        break
      case 'messages':
        Taro.switchTab({ url: '/pages/messages/index' })
        break
      default:
        break
    }
  }

  return (
    <MobileLayout
      enableSafeArea
      className="home-page"
      footer={
        <BottomNavigation
          messageCount={3}
        />
      }
    >
      <ScrollView
        className="home-scroll"
        scrollY
        enhanced
        showScrollbar={false}
      >
        {/* 工作流概览 */}
        <WorkflowOverview
          stats={stats}
          className="home-overview"
        />

        {/* 快速操作 */}
        <QuickActions
          onActionClick={handleQuickActionClick}
          actions={[
            {
              id: 'create_workflow',
              title: '创建流程',
              icon: <Plus size="24" />,
              color: '#fff',
              bgColor: 'linear-gradient(135deg, #576b95 0%, #4a5d87 100%)',
              description: '快速创建新的工作流程'
            },
            {
              id: 'my_tasks',
              title: '我的任务',
              icon: <CheckNormal size="24" />,
              color: '#07c160',
              bgColor: '#e8f7ee',
              count: 8,
              description: '查看分配给我的任务'
            },
            {
              id: 'team_tasks',
              title: '团队任务',
              icon: <CheckNormal size="24" />,
              color: '#576b95',
              bgColor: '#e8f0fe',
              count: 12,
              description: '查看团队所有任务'
            },
            {
              id: 'pending_approval',
              title: '待我审批',
              icon: <CheckNormal size="24" />,
              color: '#ff8f00',
              bgColor: '#fff2e8',
              count: 5,
              description: '需要我审批的任务'
            }
          ]}
          columns={2}
          title="快速操作"
          className="home-actions"
        />

        {/* 底部安全区域占位 */}
        <View className="bottom-spacer" />
      </ScrollView>
    </MobileLayout>
  )
}

export default HomePage
