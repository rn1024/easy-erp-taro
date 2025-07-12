import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { SearchBar, Popup, Button, RadioGroup, Radio, Cell, PullToRefresh } from '@nutui/nutui-react-taro'
import { Filter as FilterIcon } from '@nutui/icons-react-taro'
import MobileLayout from '@/components/layout/MobileLayout'
import TaskCard from '@/components/business/TaskCard'
import { Task } from '@/types'
import { mockTasks } from '@/constants/mockData'
import './index.scss'

interface FilterState {
  status: string
  priority: string
  assignee: string
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchValue, setSearchValue] = useState('')
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priority: '',
    assignee: ''
  })

  // 筛选后的任务列表
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchValue || 
        task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(searchValue.toLowerCase())
      
      const matchesStatus = !filters.status || task.status === filters.status
      const matchesPriority = !filters.priority || task.priority === filters.priority
      const matchesAssignee = !filters.assignee || task.assignee.name === filters.assignee
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })
  }, [tasks, searchValue, filters])

  // 活跃筛选条件数量
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== '').length
  }, [filters])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleTaskClick = (task: Task) => {
    console.log('点击任务:', task.title)
    // 这里可以导航到任务详情页
  }

  const handleFilterConfirm = () => {
    setShowFilterPopup(false)
  }

  const handleFilterReset = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: ''
    })
  }

  const handleRefresh = async () => {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 这里可以重新加载任务数据
    console.log('刷新任务列表')
  }

  const getStatusOptions = () => [
    { label: '全部状态', value: '' },
    { label: '待处理', value: 'pending' },
    { label: '进行中', value: 'in_progress' },
    { label: '已完成', value: 'completed' },
    { label: '已拒绝', value: 'cancelled' }
  ]

  const getPriorityOptions = () => [
    { label: '全部优先级', value: '' },
    { label: '低优先级', value: 'low' },
    { label: '中优先级', value: 'medium' },
    { label: '高优先级', value: 'high' }
  ]

  const getAssigneeOptions = () => {
    const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee.name)))
    return [
      { label: '全部负责人', value: '' },
      ...uniqueAssignees.map(name => ({ label: name, value: name }))
    ]
  }

  return (
    <MobileLayout className="tasks-page">
      <View className="tasks-page__wrapper">
        {/* 搜索和筛选栏 - 移到SafeArea内部 */}
        <View className="tasks-page__search-bar">
          <View className="tasks-page__search-input">
            <SearchBar
              placeholder="搜索任务、负责人..."
              value={searchValue}
              onSearch={handleSearch}
              onChange={setSearchValue}
            />
          </View>
          <View 
            className="tasks-page__filter-btn"
            onClick={() => setShowFilterPopup(true)}
          >
            <FilterIcon size="20" />
            <Text className="tasks-page__filter-text">筛选</Text>
            {activeFilterCount > 0 && (
              <View className="tasks-page__filter-badge">
                {activeFilterCount}
              </View>
            )}
          </View>
        </View>

        {/* 页面内容 */}
        <View className="tasks-page__container">
          <PullToRefresh onRefresh={handleRefresh}>
            <View className="tasks-page__content">
              {/* 页面标题 */}
              <View className="tasks-page__header">
                <Text className="tasks-page__title">
                  任务列表 ({filteredTasks.length})
                </Text>
              </View>

              {/* 搜索结果提示 */}
              {searchValue && (
                <View className="tasks-page__search-result">
                  搜索 "{searchValue}" 找到 {filteredTasks.length} 个结果
                </View>
              )}

              {/* 任务列表 */}
              <View className="tasks-page__list">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={handleTaskClick}
                    />
                  ))
                ) : (
                  <View className="tasks-page__empty">
                    <Text className="tasks-page__empty-icon">📝</Text>
                    <Text className="tasks-page__empty-text">
                      {searchValue || activeFilterCount > 0 
                        ? '没有找到匹配的任务' 
                        : '暂无任务，点击右下角创建新任务'
                      }
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </PullToRefresh>
        </View>
      </View>

      {/* 筛选弹窗 */}
      <Popup
        visible={showFilterPopup}
        position="bottom"
        onClose={() => setShowFilterPopup(false)}
        className="tasks-page__filter-popup"
        lockScroll={true}
        overlay={true}
      >
        <View className="tasks-page__filter-content">
          {/* 弹窗标题 */}
          <View className="tasks-page__filter-header">
            <Text className="tasks-page__filter-title">筛选条件</Text>
          </View>

          {/* 状态筛选 */}
          <View className="tasks-page__filter-section">
            <Text className="tasks-page__filter-label">任务状态</Text>
            <RadioGroup
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value as string }))}
            >
              {getStatusOptions().map(option => (
                <Cell key={option.value}>
                  <Radio value={option.value}>{option.label}</Radio>
                </Cell>
              ))}
            </RadioGroup>
          </View>

          {/* 优先级筛选 */}
          <View className="tasks-page__filter-section">
            <Text className="tasks-page__filter-label">优先级</Text>
            <RadioGroup
              value={filters.priority}
              onChange={(value) => setFilters(prev => ({ ...prev, priority: value as string }))}
            >
              {getPriorityOptions().map(option => (
                <Cell key={option.value}>
                  <Radio value={option.value}>{option.label}</Radio>
                </Cell>
              ))}
            </RadioGroup>
          </View>

          {/* 负责人筛选 */}
          <View className="tasks-page__filter-section">
            <Text className="tasks-page__filter-label">负责人</Text>
            <RadioGroup
              value={filters.assignee}
              onChange={(value) => setFilters(prev => ({ ...prev, assignee: value as string }))}
            >
              {getAssigneeOptions().map(option => (
                <Cell key={option.value}>
                  <Radio value={option.value}>{option.label}</Radio>
                </Cell>
              ))}
            </RadioGroup>
          </View>

          {/* 操作按钮 */}
          <View className="tasks-page__filter-actions">
            <Button 
              className="tasks-page__filter-reset"
              onClick={handleFilterReset}
            >
              重置
            </Button>
            <Button 
              type="primary"
              className="tasks-page__filter-confirm"
              onClick={handleFilterConfirm}
            >
              确定
            </Button>
          </View>
        </View>
      </Popup>
    </MobileLayout>
  )
}

export default Tasks 