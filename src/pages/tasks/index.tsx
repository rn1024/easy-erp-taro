import React, { useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  MobileLayout,
  BottomNavigation,
  TopNavigation,
  TaskCard
} from '../../components'
import { getMockData } from '../../data/mockData'
import type { Task } from '../../components'
import './index.scss'

const TasksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tasks')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState(0)

  // 获取模拟数据
  const { tasks } = getMockData()

  // 筛选任务
  const filteredTasks = tasks.filter(task => {
    if (searchQuery) {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // 处理筛选
  const handleFilter = (filters: any) => {
    console.log('应用筛选:', filters)
    // 这里可以实现具体的筛选逻辑
    setActiveFilters(Object.keys(filters).length)
  }

  // 处理任务点击
  const handleTaskClick = (task: Task) => {
    console.log('点击任务:', task.title)
    Taro.showToast({
      title: `查看任务: ${task.title}`,
      icon: 'none',
      duration: 2000
    })
  }

  // 处理底部导航切换
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)

    // 所有tabBar页面都使用switchTab进行跳转
    switch (tab) {
      case 'home':
        Taro.switchTab({ url: '/pages/home/index' })
        break
      case 'create':
        Taro.switchTab({ url: '/pages/create/index' })
        break
      case 'messages':
        Taro.switchTab({ url: '/pages/messages/index' })
        break
      case 'profile':
        Taro.switchTab({ url: '/pages/profile/index' })
        break
      default:
        break
    }
  }

  return (
    <MobileLayout
      enableSafeArea
      className="tasks-page"
      header={
        <TopNavigation
          onSearch={handleSearch}
          onFilter={handleFilter}
          activeFilters={activeFilters}
        />
      }
      footer={
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          messageCount={3}
        />
      }
    >
      <ScrollView
        className="tasks-scroll"
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className="tasks-content">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onTaskClick={handleTaskClick}
              />
            ))
          ) : (
            <View className="empty-state">
              <View className="empty-icon">📝</View>
              <View className="empty-title">暂无任务</View>
              <View className="empty-desc">
                {searchQuery ? '没有找到相关任务' : '还没有分配给您的任务'}
              </View>
            </View>
          )}

          {/* 底部安全区域占位 */}
          <View className="bottom-spacer" />
        </View>
      </ScrollView>
    </MobileLayout>
  )
}

export default TasksPage
