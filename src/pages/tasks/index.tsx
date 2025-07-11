import React, { useState, useMemo } from 'react'
import { View } from '@tarojs/components'
import { PullToRefresh, Empty } from '@nutui/nutui-react-taro'
import MobileLayout from '@/components/layout/MobileLayout'
import TopNavigation from '@/components/business/TopNavigation'
import TaskCard from '@/components/business/TaskCard'
import { mockTasks } from '@/constants/mockData'
import { Task, SearchFilters } from '@/types'
import './index.scss'

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})

  // 过滤任务
  const filteredTasks = useMemo(() => {
    let result = tasks

    // 关键词搜索
    if (searchKeyword) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        task.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase()))
      )
    }

    // 状态过滤
    if (filters.status && filters.status.length > 0) {
      result = result.filter(task => filters.status!.includes(task.status))
    }

    // 优先级过滤
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter(task => filters.priority!.includes(task.priority))
    }

    // 负责人过滤
    if (filters.assignee && filters.assignee.length > 0) {
      result = result.filter(task => filters.assignee!.includes(task.assignee.id))
    }

    return result
  }, [tasks, searchKeyword, filters])

  const handleRefresh = async () => {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重新获取任务数据
    setTasks([...mockTasks]) // 模拟刷新数据
    console.log('刷新任务列表')
  }

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
  }

  const handleFilter = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleTaskClick = (task: Task) => {
    console.log('点击任务:', task.id)
    // 这里可以导航到任务详情页面
  }

  const renderTaskList = () => {
    if (filteredTasks.length === 0) {
      return (
        <View className="tasks-page__empty">
          <Empty 
            description={searchKeyword || Object.keys(filters).length > 0 ? '没有找到匹配的任务' : '暂无任务'}
          />
        </View>
      )
    }

    return (
      <View className="tasks-page__list">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={handleTaskClick}
          />
        ))}
      </View>
    )
  }

  return (
    <MobileLayout className="tasks-page">
      <TopNavigation
        title="任务列表"
        showSearch
        showFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        placeholder="搜索任务标题、描述或标签..."
      />
      
      <PullToRefresh
        onRefresh={handleRefresh}
        className="tasks-page__refresh"
      >
        <View className="tasks-page__content">
          {searchKeyword && (
            <View className="tasks-page__search-result">
              找到 {filteredTasks.length} 个相关任务
            </View>
          )}
          
          {renderTaskList()}
        </View>
      </PullToRefresh>
    </MobileLayout>
  )
}

export default Tasks 