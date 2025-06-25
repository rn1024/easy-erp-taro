import React, { useEffect } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  MobileLayout,
  BottomNavigation,
  WorkflowOverview,
  QuickActions
} from '../../components'
import { Plus, CheckNormal, User, Clock, Setting } from '@nutui/icons-react-taro'
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
      case 'data_reports':
        Taro.showToast({
          title: '数据报告功能开发中',
          icon: 'none',
          duration: 2000
        })
        break
      case 'workflow_settings':
        Taro.showToast({
          title: '流程设置功能开发中',
          icon: 'none',
          duration: 2000
        })
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
      className="home-page"
      hasBottomTab={true}
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
              icon: <User size="24" />,
              color: '#576b95',
              bgColor: '#e8f0fe',
              count: 15,
              description: '查看团队所有任务'
            },
            {
              id: 'pending_approval',
              title: '待我审批',
              icon: <Clock size="24" />,
              color: '#ff8f00',
              bgColor: '#fff2e8',
              count: 3,
              description: '需要我审批的任务'
            },
            {
              id: 'data_reports',
              title: '数据报告',
              icon: <CheckNormal size="24" />,
              color: '#6f42c1',
              bgColor: '#f3f0ff',
              description: '查看工作流统计数据'
            },
            {
              id: 'workflow_settings',
              title: '流程设置',
              icon: <Setting size="24" />,
              color: '#6c757d',
              bgColor: '#f8f9fa',
              description: '管理工作流程设置'
            }
          ]}
          columns={2}
          title="快速操作"
          className="home-actions"
        />


      </ScrollView>
    </MobileLayout>
  )
}

export default HomePage
