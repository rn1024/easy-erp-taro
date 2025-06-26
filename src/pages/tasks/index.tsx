import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import {
  TopNavigation,
  TaskCard
} from '../../components'
import { getMockData } from '../../data/mockData'
import tabBarManager from '../../utils/tabBarManager'
import './index.scss'

const TasksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState(0)

  // 获取模拟数据
  const { tasks } = getMockData()

  useEffect(() => {
    // 设置当前激活的Tab
    tabBarManager.setActiveTab(1)
  }, [])

  useDidShow(() => {
    // 设置自定义 tabBar 的选中状态
    if (typeof Taro.getTabBar === 'function') {
      const tabBar = Taro.getTabBar(Taro.getCurrentInstance().page) as any
      if (tabBar && tabBar.setData) {
        tabBar.setData({
          selected: 1
        })
      }
    }
  })

  // 筛选任务
  const filteredTasks = tasks.filter(task => {
    if (searchQuery) {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  // 处理任务点击
  const handleTaskClick = (task: any) => {
    console.log('点击任务:', task.id)
    // 这里可以跳转到任务详情页
    Taro.showToast({
      title: '任务详情开发中',
      icon: 'none',
      duration: 2000
    })
  }

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // 处理筛选
  const handleFilter = (filters: any) => {
    console.log('应用筛选:', filters)
    setActiveFilters(Object.keys(filters).length)
  }

  return (
    <View className="tasks-page">
      {/* 顶部导航 */}
      <TopNavigation
        title="我的任务"
        showSearch
        showFilter
        searchPlaceholder="搜索任务或负责人"
        onSearch={handleSearch}
        onFilter={handleFilter}
        activeFilters={activeFilters}
      />

      {/* 任务列表 */}
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
              <Text className="empty-text">暂无任务</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default TasksPage
