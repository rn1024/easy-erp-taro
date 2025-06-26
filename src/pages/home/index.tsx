import React, { useEffect } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import {
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

  useDidShow(() => {
    // 设置自定义 tabBar 的选中状态
    if (typeof Taro.getTabBar === 'function') {
      const tabBar = Taro.getTabBar(Taro.getCurrentInstance().page) as any
      if (tabBar && tabBar.setData) {
        tabBar.setData({
          selected: 0
        })
      }
    }
  })

  // 处理快速操作点击
  const handleQuickActionClick = (actionId: string) => {
    console.log('点击快速操作:', actionId)

    switch (actionId) {
      case 'create_workflow':
        Taro.switchTab({ url: '/pages/create/index' })
        break
      case 'pending_tasks':
        Taro.switchTab({ url: '/pages/tasks/index' })
        break
      case 'profile':
        Taro.switchTab({ url: '/pages/profile/index' })
        break
      default:
        console.log('未处理的操作:', actionId)
    }
  }

  return (
    <View className="home-page">
      <ScrollView
        className="home-scroll"
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className="home-content">
          {/* 工作流概览 */}
          <WorkflowOverview stats={stats} />

          {/* 快速操作 */}
          <QuickActions onActionClick={handleQuickActionClick} />
        </View>
      </ScrollView>
    </View>
  )
}

export default HomePage
