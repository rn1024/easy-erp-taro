import React, { useEffect, useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button, Dialog } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import { SectionCard, StatsGrid, FilterChips, ProgressBar, type StatsGridItem } from '@/components/common'

import './index.scss'

enum PackageStatus {
  PENDING_ARRIVAL = 'pending_arrival',
  WAITING_PACKAGE = 'waiting_package',
  IN_PACKAGING = 'in_packaging',
  COMPLETED = 'completed'
}

const StatusLabels: Record<PackageStatus, string> = {
  [PackageStatus.PENDING_ARRIVAL]: '待到货',
  [PackageStatus.WAITING_PACKAGE]: '等待包装',
  [PackageStatus.IN_PACKAGING]: '正在包装',
  [PackageStatus.COMPLETED]: '已完成'
}

const StatusColors: Record<PackageStatus, string> = {
  [PackageStatus.PENDING_ARRIVAL]: '#6b7280',
  [PackageStatus.WAITING_PACKAGE]: '#f59e0b',
  [PackageStatus.IN_PACKAGING]: '#3b82f6',
  [PackageStatus.COMPLETED]: '#10b981'
}

interface PackageTask {
  id: string
  shop: string
  category: string
  productName: string
  totalQty: number
  progress: number
  status: PackageStatus
  createdAt: string
  updatedAt: string
}

const MOCK_TASKS: PackageTask[] = [
  {
    id: '1',
    shop: '天猫旗舰店',
    category: '电子产品',
    productName: 'iPhone 15 Pro 保护壳套装',
    totalQty: 150,
    progress: 85,
    status: PackageStatus.IN_PACKAGING,
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T14:30:00Z'
  },
  {
    id: '2',
    shop: '京东专营店',
    category: '家居用品',
    productName: '智能扫地机器人',
    totalQty: 80,
    progress: 100,
    status: PackageStatus.COMPLETED,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T16:00:00Z'
  },
  {
    id: '3',
    shop: '拼多多店铺',
    category: '服装配件',
    productName: '冬季保暖手套',
    totalQty: 200,
    progress: 0,
    status: PackageStatus.PENDING_ARRIVAL,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
  },
  {
    id: '4',
    shop: '淘宝旗舰店',
    category: '美妆护肤',
    productName: '精华液套装',
    totalQty: 120,
    progress: 25,
    status: PackageStatus.WAITING_PACKAGE,
    createdAt: '2025-01-01T11:00:00Z',
    updatedAt: '2025-01-01T13:00:00Z'
  },
  {
    id: '5',
    shop: '天猫旗舰店',
    category: '电子产品',
    productName: 'MacBook Pro 电脑包',
    totalQty: 95,
    progress: 60,
    status: PackageStatus.IN_PACKAGING,
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-01-02T11:30:00Z'
  }
]

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: PackageStatus.PENDING_ARRIVAL, label: StatusLabels[PackageStatus.PENDING_ARRIVAL] },
  { value: PackageStatus.WAITING_PACKAGE, label: StatusLabels[PackageStatus.WAITING_PACKAGE] },
  { value: PackageStatus.IN_PACKAGING, label: StatusLabels[PackageStatus.IN_PACKAGING] },
  { value: PackageStatus.COMPLETED, label: StatusLabels[PackageStatus.COMPLETED] }
]

const PackageTaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<PackageTask[]>([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [currentTask, setCurrentTask] = useState<PackageTask | null>(null)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setTasks(MOCK_TASKS)
      setLoading(false)
    }, 300)
  }, [])

  const filteredTasks = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()
    return tasks.filter(task => {
      const matchesKeyword = keyword
        ? task.productName.toLowerCase().includes(keyword) ||
          task.shop.toLowerCase().includes(keyword) ||
          task.category.toLowerCase().includes(keyword)
        : true
      const matchesStatus = statusFilter ? task.status === statusFilter : true
      return matchesKeyword && matchesStatus
    })
  }, [searchValue, statusFilter, tasks])

  const stats = useMemo(() => {
    const total = tasks.length
    const pendingArrival = tasks.filter(task => task.status === PackageStatus.PENDING_ARRIVAL).length
    const waitingPackage = tasks.filter(task => task.status === PackageStatus.WAITING_PACKAGE).length
    const inPackaging = tasks.filter(task => task.status === PackageStatus.IN_PACKAGING).length
    const completed = tasks.filter(task => task.status === PackageStatus.COMPLETED).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, pendingArrival, waitingPackage, inPackaging, completed, completionRate }
  }, [tasks])

  const statsItems = useMemo<StatsGridItem[]>(() => ([
    {
      key: 'total',
      label: '包装任务',
      value: stats.total,
      iconName: 'inventory',
      iconColor: '#3b82f6'
    },
    {
      key: 'inPackaging',
      label: '进行中',
      value: stats.inPackaging,
      iconName: 'autorenew',
      iconColor: '#3b82f6'
    },
    {
      key: 'pending',
      label: '待处理',
      value: stats.pendingArrival + stats.waitingPackage,
      iconName: 'schedule',
      iconColor: '#f59e0b'
    },
    {
      key: 'completed',
      label: '已完成',
      value: stats.completed,
      iconName: 'check_circle',
      iconColor: '#10b981',
      trendText: `完成率 ${stats.completionRate}%`
    }
  ]), [stats])

  const handleTaskClick = (task: PackageTask) => {
    setCurrentTask(task)
    setShowStatusDialog(true)
  }

  const handleStatusChange = (status: PackageStatus) => {
    if (!currentTask) return
    setTasks(prev => prev.map(item => (item.id === currentTask.id
      ? { ...item, status, updatedAt: new Date().toISOString(), progress: status === PackageStatus.COMPLETED ? 100 : item.progress }
      : item
    )))
    setShowStatusDialog(false)
    setCurrentTask(null)
    Taro.showToast({ title: '状态更新成功', icon: 'success' })
  }

  const handleFilterChange = (values: string[]) => {
    setStatusFilter(values[0] ?? '')
  }

  return (
    <MobileLayout className='package-task'>
      <View className='package-task__content'>
        <SectionCard title='包装任务概览' description='掌握包装任务整体进度' compact>
          <StatsGrid items={statsItems} />
        </SectionCard>

        <SectionCard
          title='任务筛选'
          description='按关键词或状态过滤任务'
          compact
        >
          <SearchBar
            value={searchValue}
            placeholder='搜索产品昵称、店铺或分类'
            onChange={setSearchValue}
            onSearch={setSearchValue}
          />
          <FilterChips
            options={STATUS_OPTIONS}
            selectedValues={statusFilter ? [statusFilter] : []}
            onChange={handleFilterChange}
            allowClear
            scrollable
          />
        </SectionCard>

        <SectionCard
          title='任务列表'
          description={`共 ${filteredTasks.length} 个任务（所有任务 ${stats.total}）`}
          compact
        >
          <View className='package-task__list'>
            {filteredTasks.map(task => (
              <View key={task.id} className='package-task__card' onClick={() => handleTaskClick(task)}>
                <View className='package-task__card-header'>
                  <View className='package-task__card-title'>
                    <Text className='package-task__card-name'>{task.productName}</Text>
                    <View
                      className='package-task__status'
                      style={{ backgroundColor: StatusColors[task.status] }}
                    >
                      {StatusLabels[task.status]}
                    </View>
                  </View>
                  <MaterialIcons name='chevron_right' size={24} color='#9ca3af' />
                </View>

                <View className='package-task__meta'>
                  <Text className='package-task__meta-item'>店铺：{task.shop}</Text>
                  <Text className='package-task__meta-item'>分类：{task.category}</Text>
                  <Text className='package-task__meta-item'>数量：{task.totalQty}</Text>
                </View>

                <View className='package-task__progress'>
                  <Text className='package-task__progress-text'>当前进度 {task.progress}%</Text>
                  <ProgressBar value={task.progress} showLabel={false} />
                </View>

                <View className='package-task__timestamps'>
                  <Text>创建：{task.createdAt.slice(0, 10)}</Text>
                  <Text>更新：{task.updatedAt.slice(0, 10)}</Text>
                </View>
              </View>
            ))}

            {!loading && filteredTasks.length === 0 && (
              <View className='package-task__empty'>
                <MaterialIcons name='inventory_2' size={64} color='#d1d5db' />
                <Text className='package-task__empty-title'>暂无符合条件的任务</Text>
                <Text className='package-task__empty-text'>尝试调整筛选条件或等待任务生成</Text>
              </View>
            )}
          </View>
        </SectionCard>
      </View>

      <Dialog
        visible={showStatusDialog}
        title='更新任务状态'
        closeOnOverlayClick
        onClose={() => setShowStatusDialog(false)}
        footerButtons={[
          {
            text: '取消',
            plain: true,
            onClick: () => setShowStatusDialog(false)
          }
        ]}
      >
        {currentTask && (
          <View className='package-task__dialog'>
            <Text className='package-task__dialog-title'>选择新的任务状态</Text>
            <View className='package-task__dialog-options'>
              {Object.values(PackageStatus).map(status => (
                <Button
                  key={status}
                  size='small'
                  style={{
                    marginBottom: '16rpx',
                    background: StatusColors[status],
                    color: '#ffffff'
                  }}
                  onClick={() => handleStatusChange(status)}
                  block
                >
                  {StatusLabels[status]}
                </Button>
              ))}
            </View>
          </View>
        )}
      </Dialog>
    </MobileLayout>
  )
}

export default PackageTaskPage
