import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import { Icon } from '@/components/common'

import './index.scss'

type TaskStatus = 'progress' | 'pending' | 'completed' | 'rejected'
type TaskPriority = 'high' | 'medium' | 'low'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: {
    name: string
    avatar: string
  }
  progress: {
    current: number
    total: number
    label: string
  }
  deadline: string
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  progress: { label: '进行中', className: 'task-card__status--progress' },
  pending: { label: '待处理', className: 'task-card__status--pending' },
  completed: { label: '已完成', className: 'task-card__status--completed' },
  rejected: { label: '已拒绝', className: 'task-card__status--rejected' }
}

const priorityConfig: Record<TaskPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级'
}

const Tasks: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: '产品需求评审',
      description: '对新版本产品功能进行需求评审，确认技术实现方案',
      status: 'progress',
      priority: 'high',
      assignee: {
        name: '张三',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      progress: {
        current: 2,
        total: 4,
        label: '技术评审'
      },
      deadline: '6月25日'
    },
    {
      id: '2',
      title: '用户界面设计',
      description: '完成新功能的UI/UX设计，包括原型图和交互说明',
      status: 'pending',
      priority: 'medium',
      assignee: {
        name: '李四',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      progress: {
        current: 1,
        total: 3,
        label: '设计初稿'
      },
      deadline: '6月28日'
    },
    {
      id: '3',
      title: '数据库优化',
      description: '优化数据库查询性能，提升系统响应速度',
      status: 'completed',
      priority: 'high',
      assignee: {
        name: '王五',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      progress: {
        current: 3,
        total: 3,
        label: '已完成'
      },
      deadline: '6月22日'
    },
    {
      id: '4',
      title: '移动端适配',
      description: '完成移动端响应式设计适配，确保各设备正常显示',
      status: 'rejected',
      priority: 'low',
      assignee: {
        name: '赵六',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      progress: {
        current: 2,
        total: 4,
        label: '设计审查'
      },
      deadline: '6月20日'
    }
  ])

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 模拟刷新逻辑
  }

  const handleTaskClick = (taskId: string) => {
    // 导航到任务详情页面
    // TODO: 实现任务详情页面导航
    return taskId
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchText.toLowerCase()) ||
    task.assignee.name.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <MobileLayout className='tasks-page'>
      <View className='tasks-page__wrapper'>
        {/* 搜索和筛选区域 */}
        <View className='tasks-page__search-section'>
          <SearchBar
            placeholder='搜索任务、负责人...'
            value={searchText}
            onChange={setSearchText}
            onSearch={setSearchText}
            className='tasks-page__search-bar'
          />
          <View 
            className='tasks-page__filter-button' 
            onClick={() => {
              // TODO: 实现筛选功能
            }}
          >
            <Icon name='filter_list' size={16} color='var(--text-secondary)' />
            <Text className='tasks-page__filter-text'>筛选</Text>
          </View>
        </View>

        <PullToRefresh onRefresh={handleRefresh}>
          <View className='tasks-page__content'>
            {/* 任务列表 */}
            <View className='tasks-page__task-list'>
              {filteredTasks.map((task) => {
                const statusInfo = statusConfig[task.status]
                const progressPercentage = (task.progress.current / task.progress.total) * 100

                return (
                  <View
                    key={task.id}
                    className='task-card'
                    onClick={() => handleTaskClick(task.id)}
                  >
                    {/* 任务头部 - 头像和标题 */}
                    <View className='task-card__header'>
                      <Image
                        className='task-card__avatar'
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                      />
                      <View className='task-card__info'>
                        <Text className='task-card__title'>{task.title}</Text>
                        <Text className='task-card__assignee'>{task.assignee.name}</Text>
                      </View>
                      <View className={`task-card__status ${statusInfo.className}`}>
                        <Text className='task-card__status-text'>{statusInfo.label}</Text>
                      </View>
                    </View>

                    {/* 任务描述 */}
                    <Text className='task-card__description'>{task.description}</Text>

                    {/* 进度条 */}
                    <View className='task-card__progress'>
                      <View className='task-card__progress-header'>
                        <Text className='task-card__progress-label'>
                          {task.progress.label}
                        </Text>
                        <Text className='task-card__progress-text'>
                          {task.progress.current}/{task.progress.total}
                        </Text>
                      </View>
                      <View className='task-card__progress-bar'>
                        <View
                          className='task-card__progress-fill'
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </View>
                    </View>

                    {/* 底部信息 */}
                    <View className='task-card__footer'>
                      <View className='task-card__deadline-wrapper'>
                        <Icon name='schedule' size={12} color='var(--text-tertiary)' />
                        <Text className='task-card__deadline'>{task.deadline}</Text>
                      </View>
                      <Text className='task-card__priority'>
                        {priorityConfig[task.priority]}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        </PullToRefresh>
      </View>
    </MobileLayout>
  )
}

export default Tasks